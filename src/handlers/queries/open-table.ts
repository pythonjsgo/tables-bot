import db from '../../db-manager.js'
import { giftBuilder } from '../../keyboards.js'
import * as randomstring from 'randomstring'
import { g3PlusMasterSearcher, getTodayDate, tableUpperSearcher } from '../../logic.js'
import { TABLES } from '../../../config.js'

export const middleware = async (ctx: any) => {
    const userID = <number>ctx.from.id
    const tableTitle = ctx.callbackQuery.data.split('|')[1].trim()
    // tableTitle = tableTitle.slice(0, tableTitle.indexOf('/') + 1)
    console.log('tableTitle', tableTitle)
    const userData = await db.users.findOne({ userID })
    if (userData?.tables?.[tableTitle]) {
        await ctx.answerCallbackQuery(
            // @ts-ignore
            { text: `У вас уже открыт ${TABLES[tableTitle].title} стол!` }
        )
        return null
    }

    // checking and if is good, do this
    if (tableTitle === 'bronze') {
        const MASTER_GIFT = 5000
        const REFERRAL_GIFT = 1000
        if (!userData?.referrerID) return ctx.reply('Зарегестрируйтесь по реферральной ссылке')
        const upper = await tableUpperSearcher(userData.referrerID)
        const referrerData = await db.users.findOne({ userID: userData.referrerID })

        // if (upper.tables[tableTitle].downers.length >= 2) {
        //     db.users.updateOne({ userID: upper.userID }, {
        //         $set: {
        //             ['tables.']
        //         }
        //     })
        // }
        db.users.updateOne({ userID: upper.userID }, {
            $addToSet: {
                [`tables.${tableTitle}.downers`]: userID
            }
        }, {
            upsert: true
        })
        // ctx.reply(referrerData)
        // ctx.reply(JSON.stringify(referrerData, null, 2))
        db.users.updateOne({ userID: referrerData?.userID }, { $addToSet: { referrals: userID } }, { upsert: true })
        const table: any = {}
        table.id = randomstring.generate(5)
        table.status = 'created'
        // @ts-ignore
        table.title = TABLES[tableTitle].title
        table.owner = userID
        table.master = upper.referrerID
        table.referrer = userData.referrerID
        table.gifts = []
        table.techTitle = tableTitle
        table.upper = upper.userID
        table.creationDate = getTodayDate()
        table.joinDate = Date.now()
        table.super = parseInt(userData?.superReferrerID)

        const upperTableData = await db.tables.findOne({
            $and: [
                { owner: upper.userID },
                { techTitle: tableTitle }
            ]
        })
        // ctx.reply(JSON.stringify(upperTableData, null, 2))
        const masterID = upperTableData.upper
        const masterData: any = await db.users.findOne({ userID: masterID })
        const upperRelativesData = upper.tables?.bronze?.relatives || {}
        for (const key of Object.keys(upperRelativesData)) {
            upperRelativesData[key] = upperRelativesData[key] + 1
        }
        console.log(table.id, 'fdlkdfjfdlfdjlklfkd')
        const superReferrerData = await db.users.findOne({ userID: userData?.superReferrerID })
        ctx.editMessageCaption({
            caption: `Добро пожаловать на
🥉 Бронзовый стол (${getTodayDate()})
ID стола: ${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (<code>Привет 👋, Хочу подарить тебе  денежный подарок🎁</code>)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

<b>Мастер: </b> @${masterData?.username} подарок - ${MASTER_GIFT}
<b>Пригласитель: </b> @${superReferrerData?.username || referrerData?.username} подарок - ${REFERRAL_GIFT}₽
`,
            reply_markup: giftBuilder([{
                name: masterData?.username,
                amount: MASTER_GIFT
            }, {
                name: superReferrerData?.username || referrerData?.username,
                amount: REFERRAL_GIFT
            }], table.id, [], []),
            parse_mode: 'HTML'
        })
        ctx.api.sendMessage(upper.userID, `<b>На ваш ${table.title}</b> зашёл новый партнёр ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' })
        ctx.api.sendMessage(masterData.userID, `<b>На ваш ${table.title}</b> зашёл новый даритель ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' })
        console.log('masterData', masterData, 'referrerData', referrerData)
        table.gifts.push(
            {
                amount: REFERRAL_GIFT,
                from: userID,
                to: superReferrerData?.userID || referrerData?.userID
            }, {
                amount: MASTER_GIFT,
                from: userID,
                to: masterData.userID
            })
        db.tables.insertOne(table)
        db.users.updateOne({ userID }, {
            $set: {
                'tables.bronze': {
                    status: 'created',
                    relatives: Object.assign(
                        { ...upperRelativesData }
                        , { [userID]: 0 }),
                    id: table.id,
                    title: table.title
                }
            }
        })
        setTimeout(async () => {
            // if not done us  erban
            const tableData = await db.tables.findOne({ id: table.id })
            if (!tableData?.gifts?.filter((i: { status: string }) => i.status === 'confirmed')?.length && tableData.status === 'created') {
                await db.users.updateOne({ userID }, {
                    $unset: { [`tables.${tableData.techTitle}`]: '' }
                })
                await db.users.updateOne({
                    userID: tableData.upper
                }, {
                    $pull: {
                        [`tables.${tableData.techTitle}.downers`]: userID
                    }
                })
                ctx.reply('Вы были автоматически удалены со стола!', { parse_mode: 'HTML' })
            }
        }, 1000 * 60 * 60 * 24) // 24h
    } else {
        // @ts-ignore
        const tableMeta = TABLES[tableTitle]
        const MASTER_GIFT = tableMeta.masterGift
        const REFERRAL_GIFT = tableMeta.referrerGift
        let referrerData = await db.users.findOne({ userID: userData.referrerID })
        let superReferrerData = await db.users.findOne({ userID: userData?.superReferrerID })
        if (tableTitle === 'start') {
            referrerData = null
            superReferrerData = null
        }
        let alphaPriority = 0
        if (!referrerData?.tables?.[tableTitle] && tableTitle !== 'start') {
            alphaPriority = userData.fraction
            ctx.api.sendMessage(userData?.referrerID, `
<b>⚠️Вы пропустили реферальный бонус ${REFERRAL_GIFT} от ${userData?.username}</b>

Чтобы не пропустить следующий реферальный бонус откройте ${tableMeta.title}`)
            referrerData = null
        }

        const masterID = (await g3PlusMasterSearcher(alphaPriority || userData.referrerID, tableTitle)).userID
        const masterData = (await db.users.findOneAndUpdate(
            { userID: masterID },
            {
                $addToSet: {
                    [`tables.${tableTitle}.downers`]: userID
                }
            },
            {
                returnDocument: 'after',
                upsert: true
            }
        )).value
        try {
            if (masterData?.tables[tableTitle]?.downers?.length >= 3) {
                db.users.updateOne(
                    { userID: masterID },
                    {
                        $set: {
                            [`tables.${tableTitle}.status`]: 'done'
                        },
                        $inc: {
                            tableLevel: 1
                        }
                    }
                )
                db.tables.updateOne(
                    { id: masterData.tables[tableTitle].id },
                    {
                        $set: {
                            status: 'done'
                        }
                    }
                )
            }
        } catch (e) {
            console.error(e)
        }

        const creationDate = getTodayDate()
        const table: any = {
            id: randomstring.generate(5),
            status: 'created',
            techTitle: tableTitle,
            // @ts-ignore
            title: TABLES[tableTitle].title,
            owner: userID,
            master: masterData?.userID,
            referrer: userData?.referrerID,
            gifts: [],
            creationDate,
            joinDate: Date.now()
        }
        table.gifts.push({
            amount: MASTER_GIFT,
            from: userID,
            to: masterData.userID
        })

        if (tableTitle !== 'start') {
            if (superReferrerData?.userID || referrerData?.userID) {
                table.gifts.push(
                    {
                        amount: REFERRAL_GIFT,
                        from: userID,
                        to: superReferrerData?.userID || referrerData?.userID
                    }
                )
            }
        }
        table.super = parseInt(userData?.superReferrerID)
        ctx.api.sendMessage(masterData.userID, `<b>На ваш ${table.title}</b> зашёл новый партнёр ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' })

        let optionalLine = '<b>Пригласитель: </b>❌'
        if (superReferrerData?.userID || referrerData?.userID) {
            optionalLine = `<b>Пригласитель: </b> @${superReferrerData?.username || referrerData?.username} подарок - ${REFERRAL_GIFT}₽`
        }
        ctx.editMessageCaption({
            caption: `
            Добро пожаловать на
${tableMeta.title} (${getTodayDate()})
ID стола: ${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

Мастер: @${masterData.username} подарок - ${MASTER_GIFT}
` + optionalLine,
            reply_markup: giftBuilder([{
                name: masterData?.username,
                amount: MASTER_GIFT
            }, {
                name: referrerData?.username,
                amount: REFERRAL_GIFT
            }], table.id,
            [],
            []),
            parse_mode: 'HTML'
        })

        db.tables.insertOne(table)
        const upperRelativesData = masterData.tables?.bronze?.relatives || {}
        for (const key of Object.keys(upperRelativesData)) {
            upperRelativesData[key] = upperRelativesData[key] + 1
        }
        db.users.updateOne({ userID }, {
            $set: {
                [`tables.${tableTitle}`]: {
                    status: 'created',
                    id: table.id,
                    alphaLevel: (masterData?.tables?.[tableTitle]?.alphaLevel | 0) + 1, // some shit sulution
                    relatives: Object.assign(
                        { ...upperRelativesData }
                        , { [userID]: 0 })
                }
            }
        })
        setTimeout(async () => {
            // if not done us  erban
            const tableData = await db.tables.findOne({ id: table.id })
            if (!tableData?.gifts?.filter((i: { status: string }) => i.status === 'confirmed')?.length && tableData.status === 'created') {
                await db.users.updateOne({ userID }, {
                    $unset: { [`tables.${tableData.techTitle}`]: '' }
                })
                await db.users.updateOne({
                    userID: tableData.upper
                }, {
                    $pull: {
                        [`tables.${tableData.techTitle}.downers`]: userID
                    }
                })
                ctx.reply('Вы были автоматически удалены со стола!', { parse_mode: 'HTML' })
            }
        }, 1000 * 60 * 60 * 24) // 24h
    }
}
