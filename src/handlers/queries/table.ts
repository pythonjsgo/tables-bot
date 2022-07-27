import { giftBuilder, showUsersList, table } from '../../keyboards.js'
import { bronzeUpgrade, getBronzeDonwers, getUsernames, parseTableIdFromCbQuery } from '../../logic.js'
import db from '../../db-manager.js'
import { TABLE_PHOTO_FILE_ID, TABLES } from '../../../config.js'
import { InputFile } from 'grammy'
import { renderBronzeTable, renderG3Table } from '../../../render.js'

export default async (ctx: any) => {
    // OR render
    const data = ctx.callbackQuery.data
    const userID = ctx?.from?.id
    const userData = await db.users.findOne({ userID })
    const tableID = parseTableIdFromCbQuery(data)
    console.log('e8742389247398')
    // ST TOFIX
    const techTitle: string = (await db.tables.findOne({ id: tableID })).techTitle
    console.log('stage1')
    if (techTitle === 'bronze') await bronzeUpgrade(userID, userData)
    console.log('stage2')
    const table = await db.tables.findOne({ id: tableID })
    console.log(table)
    // ST END
    const masterData = await db.users.findOne({ userID: table.master })
    let referrerData = await db.users.findOne({ userID: table.referrer })
    let superReferrerData = await db.users.findOne({ userID: table?.super })
    console.log()
    if (table?.techTitle === 'bronze') {
        const {
            layerOne,
            layerTwo
        } = await getBronzeDonwers(tableID)

        console.log('stage3')
        if (table.status === 'created') {
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: 0 из 3
Всего дарителей на столе: 0 из 9
Выберите о ком получить информацию 👇️
`,
                reply_markup: giftBuilder(
                    // @ts-ignore
                    [{
                        name: masterData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].masterGift
                    }, {
                        name: superReferrerData?.username || referrerData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].referrerGift
                    }],
                    tableID, layerOne, layerTwo
                ),
                parse_mode: 'HTML'
            })
        }
        if (table.status === 'gifted') {
            const usersToInviteLeft = 3 - (userData?.referrals?.length | 0)

            // ctx.editMessageMedia({
            //     type: 'photo',
            //     media: { source: file }
            // })
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: ${layerOne?.length || 0} из 3
Всего дарителей на столе: ${layerTwo?.length || 0} из 9
Выберите о ком получить информацию 👇️
Пригласите еще ${usersToInviteLeft}/3 участников для разблокировки серебряного стола
        `,
                reply_markup: giftBuilder(
                    null,
                    tableID, layerOne, layerTwo
                ),
                parse_mode: 'HTML'
            })
        }

        if (table.status === 'done') {
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: ${layerOne?.length} из 3
Всего дарителей на столе: ${layerTwo?.length} из 9
Выберите о ком получить информацию 👇️
Стол выполнил свою задачу
        `,
                reply_markup: giftBuilder(
                    null,
                    tableID, layerOne, layerTwo
                ),
                parse_mode: 'HTML'
            })
        }
    } else {
        // @ts-ignore
        const MASTER_GIFT = TABLES[techTitle].masterGift
        // @ts-ignore
        const REFERRAL_GIFT = TABLES[techTitle].referrerGift
        if (!referrerData?.tables?.[techTitle]) {
            referrerData = null
        }
        if (techTitle === 'start') {
            referrerData = null
            superReferrerData = null
        }
        let optionalLine = '<b>Пригласитель: </b>❌'
        if (superReferrerData?.userID || referrerData?.userID) {
            optionalLine = `<b>Пригласитель: </b> @${superReferrerData?.username || referrerData?.username} подарок - ${REFERRAL_GIFT}₽`
        }

        if (table.status === 'created') {
            ctx.editMessageCaption({
                caption: `Добро пожаловать в ${table.title}
ID стола: #${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (<code>Привет 👋, Хочу подарить тебе  денежный подарок🎁</code>)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

` +
                    optionalLine,
                // @ts-ignore
                reply_markup: giftBuilder([{
                    name: masterData?.username,
                    // @ts-ignore
                    amount: TABLES[techTitle].masterGift
                }, {
                    name: referrerData?.username,
                    // @ts-ignore
                    amount: TABLES[techTitle].referrerGift
                }], tableID),
                parse_mode: 'HTML'
            })
        }
        if (table.status === 'gifted' || table.status === 'done') {
            const tableDowners = (await db.users.findOne({ userID })).tables[table.techTitle].downers
            console.log(tableDowners, 'sjhsdgfhjksgkfhgfdjkhgfjkh')
            ctx.editMessageCaption({
                caption: `${table.title}

ID стола: #${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (<code>Привет 👋, Хочу подарить тебе  денежный подарок🎁</code>)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)` +
                    `✅Подарки успешно подарены, пользователей снизу ${tableDowners?.length | 0}/3`,
                reply_markup: giftBuilder(null, tableID, tableDowners, []),
                parse_mode: 'HTML'
            })
        }
    }
}
