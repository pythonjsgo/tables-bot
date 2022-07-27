// LSD-25 Powered code
import { Bot, InputFile, session } from 'grammy'
import { run } from '@grammyjs/runner'
import { BOT_URL, TABLE_PHOTO_FILE_ID, TABLES, TOKEN } from '../config.js'
import {
    confirmGift,
    createSpecialReferralLink,
    deleteUserFromTable,
    openTableOrHide,
    table, tableDone,
    tables
} from './keyboards.js'
import startHandler from './handlers/commands/start.js'
import acceptHandler from './handlers/queries/accept.js'
import userChecker from './middlewares/userChecker.js'
import beginHandler from './handlers/queries/begin.js'
import tablesHandlers from './handlers/hears/tables.js'
import profileHandler from './handlers/hears/profile.js'
import aboutProjectHandler from './handlers/hears/about.js'
import mustBeAdmin from './middlewares/mustBeAdmin.js'
import adminHandler from './handlers/commands/admin.js'
import lockedHandler from './handlers/queries/locked.js'
import enterCodeHandler from './handlers/queries/enter-code.js'
import tableHandler from './handlers/queries/table.js'
import { middleware as openTableHandler } from './handlers/queries/open-table.js'
import { middleware as tablesMiddleware } from './menues/tables.js'
import db, { setUserStep } from './db-manager.js'
import { router } from './routers/get.js'
import {
    getBronzeDonwers, getBronzeDonwersForImage,
    getTodayDate, getUsernames,
    parseTableIdFromCbQuery
} from './logic.js'
import { renderBronzeTable, renderG3Table } from '../render.js'

export const bot = new Bot(TOKEN)
// DEV

// @ts-ignore
bot.use(session())
bot.use((ctx, next) => {
    const userID: number | undefined = ctx?.chat?.id
    // @ts-ignore
    if (userID > 0) {
        next()
    }
}
)
// bot.use((ctx, next) => {
//     next()
//     if (ctx?.from?.id === 882079062) {
//         next()
//     } else ctx.reply('Проводяться технические работы!')
// })

bot.use(tablesMiddleware)
bot.command(['d', 'delete_proof'], ctx => {
    db.users.deleteMany({ userID: ctx?.from?.id })
    db.tables.deleteMany({ owner: ctx?.from?.id })
    ctx.reply('+', { reply_markup: { remove_keyboard: true } }).then(message => {
        ctx.api.deleteMessage(<number>ctx?.from?.id, message.message_id)
    })
})

// bot.use((ctx, next) => {
//     if ([1560854919, 1719482730, 882079062, 5173696049].includes(<number>ctx?.from?.id)) {
//         next()
//     } else ctx.reply('Проект в разработке!')
// })
// Every callbackQuery logger
bot.on('callback_query', (ctx, next) => {
    console.log(ctx.callbackQuery.data)
    return next()
})
bot.use(userChecker)
bot.command('start', startHandler)
bot.use(router)
bot.use(tables)
bot.use(table)

bot.command('admin', mustBeAdmin, adminHandler)
bot.callbackQuery('accept', acceptHandler)
bot.callbackQuery('begin', beginHandler)
bot.callbackQuery('enterCode', enterCodeHandler)
bot.hears('Открыть стол', tablesHandlers)
bot.hears('Мой профиль', profileHandler)
bot.hears('️О проекте', aboutProjectHandler)
bot.callbackQuery(/done/, ctx => ctx.answerCallbackQuery({ text: 'Стол уже был открыт!' }))
bot.callbackQuery(/locked/, lockedHandler)

bot.callbackQuery(/remove_from_table/, async ctx => {
    const data = ctx.callbackQuery.data.split('|')[1]

    const userIDToDelete = Number(data.split(',')[0])
    const tableID = data.split(',')[1]
    const tableData = await db.tables.findOne({ id: tableID })
    const userToDeleteTableID = (await db.users.findOne({ userID: userIDToDelete })).tables[tableData.techTitle].id
    if ((await db.tables.findOne({ id: userToDeleteTableID })).gifts.filter((i: any) => i.status === 'confirmed')?.length) {
        return ctx.editMessageText('<b>Недостаточно прав для удаления пользователя!</b>', {
            parse_mode: 'HTML'
        })
    }
    db.users.updateOne(
        {
            [`tables.${tableData.techTitle}.id`]: tableID
        }, {
            $pull: {
                [`tables.${tableData.techTitle}.downers`]: userIDToDelete
            }
        }).then(() => {
        db.users.updateOne({
            userID: userIDToDelete
        }, {
            $unset: {
                tables: tableData.techTitle
            }
        })
        ctx.editMessageText('<b>Пользователь успешно удален со стола!</b>', {
            parse_mode: 'HTML'
        })
    })
})

bot.callbackQuery(/confirm_to_open_table\|/, ctx => {
    const data = ctx.callbackQuery.data
    const techTitle = parseTableIdFromCbQuery(data)
    // @ts-ignore
    const tableMeta: any = TABLES[techTitle]
    ctx.editMessageCaption({
        caption: `   
Добро пожаловать на
${tableMeta.title} (${getTodayDate()})
        
🏼Вы дарите денежный
🎁 подарок ${tableMeta.masterGift}₽ «Мастеру» и ${tableMeta.referrerGift}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (<code>Привет 👋, Хочу подарить тебе  денежный подарок🎁</code>)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)
${tableMeta.title}?`,
        reply_markup: openTableOrHide(techTitle),
        parse_mode: 'HTML'
    })
})
bot.callbackQuery(/open_table/, openTableHandler)
bot.callbackQuery('my_first_line', async ctx => {
    ctx.answerCallbackQuery()
    const userID = ctx?.from?.id
    const userData = await db.users.findOne({ userID })
    let replyText = ''
    for (const referralID of userData?.referrals) {
        const referralData = await db.users.findOne({ userID: referralID })
        let tableTitle = '🥉Бронзовый стол'
        // @ts-ignore
        console.log(Object.values(TABLES)[6])
        if (referralData?.tableLevel) {
            if (userData.tableLevel > 8) userData.tableLevel = 7
            tableTitle = Object.values(TABLES)[userData?.tableLevel].title
        }
        replyText += `Стол: ${tableTitle}
Ник: @${referralData.username}
Имя пользователя: ${referralData?.from?.first_name}
Лично приглашённых: ${referralData?.referrals?.length || 0}\n\n`
    }
    ctx.reply(replyText)
})
bot.callbackQuery(/left_table/, async (ctx: any) => {
    const userID = ctx.from.id
    const tableID = ctx.callbackQuery.data.split('|')[1]
    const tableData = await db.tables.findOne({ id: tableID })
    const downersLength = (await db.users.findOne({ userID })).tables[tableData.techTitle]?.donwers?.length
    if (!tableData?.gifts?.filter((i: { status: string }) => i.status === 'confirmed')?.length && tableData.status === 'created' && !downersLength) {
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
        ctx.editMessageCaption({
            caption: '<b>Вы успешно вышли со стола!</b>',
            parse_mode: 'HTML'
        })
    } else {
        ctx.reply('<b>Вы не можете покинуть стол!</b>', { parse_mode: 'HTML' })
    }
})
bot.callbackQuery(/notify-members/, async (ctx: any) => {
    const data = ctx.callbackQuery.data
    const text = ctx.msg.text || ctx.msg.caption
    const userID = ctx.from.id
    const tableID = data.split('|')[1]
    const tableData = await db.tables.findOne({ id: tableID })

    ctx.editMessageReplyMarkup()
    for (const gift of tableData.gifts) {
        ctx.api.sendMessage(gift.to, `🎉<b>Пользователь @${ctx.from.username} отправил вам подарок</b>
На сумму <i>${gift.amount}₽</i>`, {
            parse_mode: 'HTML',
            reply_markup: confirmGift(tableID)
        })
    }
    ctx.reply('Отправлено!')
})
bot.callbackQuery(/accept/, async ctx => {
    const data = ctx.callbackQuery.data
    const userID = ctx.from.id
    const tableID = data.split('|')[1]
    console.log(tableID, 'to be accepted')
    await db.tables.updateOne(
        {
            id: tableID,
            gifts: {
                $elemMatch: {
                    to: userID,
                    status: { $exists: false }
                }
            }
        },
        {
            $set: {
                'gifts.$.status': 'confirmed'
            }
        }, {
            upsert: true
        }
    )
    const tableData = await db.tables.findOne(
        { id: tableID })
    if (tableData.gifts.filter((i: { status: string }) => i.status === 'confirmed')?.length === tableData.gifts.length) {
        const data = await (db.tables.findOneAndUpdate(
            {
                $and: [
                    { owner: tableData.upper },
                    { techTitle: tableData.techTitle }
                ]
            }, {
                $inc: { toUnlockNextTableCounter: 1 }
            }, { upsert: true }
        )).value
        if (data?.toUnlockNextTableCounter >= 3) {
            db.users.updateOne(
                { userID: data.owner }, {
                    $inc: {
                        tableLevel: 1
                    }
                }, { upsert: true }
            )
            ctx.api.sendMessage(data.owner, '<b>🎉Разблокирован новый уровень стола!</b>', { parse_mode: 'HTML' })
        }
        db.tables.updateOne(
            { id: tableID },
            { $set: { status: 'gifted' } }
        )
        db.users.updateOne(
            { userID: tableData.owner },
            {
                $set: { referralsAllowed: true }
            },
            { upsert: true }
        ).then((r: any) => {
            if (r.modifiedCount) ctx.api.sendMessage(tableData.owner, '✅Реферальная система разблокирована!')
        })
    }
    ctx.api.sendMessage(tableData.owner, `✅Пользователь @${ctx.from.username} подтвердил получение вашего подарка!`)
    ctx.editMessageText('✅Подарок успешно подтвержден!')
})
bot.callbackQuery(/decline/, async ctx => {
    const data = ctx.callbackQuery.data
    console.log(data)
    const tableID = data.split('|')[1]
    console.log(tableID)
    const tableData = await db.tables.findOne({ id: tableID })
    ctx.api.sendMessage(tableData.owner, `❌ @${ctx.from.username} отклонил подтверждение подарка!`)
    ctx.editMessageText('❌Подарок отклонен!')
})
bot.hears('Реферальная ссылка', async ctx => {
    const userID = ctx?.from?.id
    const userData = await db.users.findOne({ userID })
    if (userData?.referralsAllowed) {
        ctx.reply(`
Чтобы зарегистрировать под себя человека скопируйте реф. ссылку или реф. код
<b>Ваша реферальная ссылка</b> - ${BOT_URL}?start=r${userID}
Ваш реферальный код: <code>${userID}</code>`, {
            reply_markup: createSpecialReferralLink,
            parse_mode: 'HTML'
        }
        )
    } else {
        ctx.reply(`<b>❌Реферальная система закрыта</b>
Для получения реферальной ссылки необходимо сделать подарки в первом столе`,
        { parse_mode: 'HTML' }
        )
    }
})
bot.callbackQuery('create-special-ref-link', async ctx => {
    const userID = ctx.from.id
    setUserStep(userID, 'get-ref-username')
    ctx.reply('<b>Отправьте имя пользователя для которого необходимо создать реф. ссылку:</b>', { parse_mode: 'HTML' })
})
bot.callbackQuery('delete_my_account', async ctx => {
    ctx.answerCallbackQuery()
    ctx.reply('🛑Для подтверждения удаления аккаунта отправьте команду /delete_proof в чат')
})
bot.callbackQuery(/back/, ctx => {
    const data = ctx.callbackQuery.data.split('|')[1]
    if (data === 'my-tables') {
        ctx.editMessageMedia(
            {
                type: 'photo',
                media: TABLE_PHOTO_FILE_ID,
                caption: 'Мои столы',
                parse_mode: 'HTML'
            }, {
                reply_markup: tables
            }
        )
    }
})

bot.callbackQuery(/table/, tableHandler)
bot.callbackQuery(/show_user\|/, async ctx => {
    ctx.answerCallbackQuery()
    const data = ctx.callbackQuery.data
    const userToFindID = Number(data.split('|')[1])
    const tableIDToPassDelete = data.split('|')[2]
    const userData = await db.users.findOne({ userID: userToFindID })
    const referrerData = await db.users.findOne({ userID: userData?.referrerID })
    if (tableIDToPassDelete) {
        ctx.reply(`<i>🔎Информация о пользователе</i>
        <b>Ник:</b> @${userData?.username}
        <b>Имя пользователя:</b> ${userData?.from?.first_name}
        <b>Пригласил:</b> @${referrerData?.username}
        <b>Лично приглашённых:</b> ${userData?.referrals?.length || 0}`, {
            reply_markup: deleteUserFromTable(userToFindID, tableIDToPassDelete),
            parse_mode: 'HTML'
        })
    } else {
        ctx.reply(`<i>🔎Информация о пользователе</i>
        <b>Ник:</b> @${userData?.username}
        <b>Имя пользователя:</b> ${userData?.from?.first_name}
        <b>Пригласил:</b> @${referrerData?.username}
        <b>Лично приглашённых:</b> ${userData?.referrals?.length || 0}`, {
            parse_mode: 'HTML'
        })
    }
})

bot.callbackQuery(/hide/, ctx => ctx.deleteMessage())
bot.callbackQuery(/show_users_list\|/, async ctx => {
    const userID = ctx?.from?.id
    const data = ctx.callbackQuery.data
    const tableID = data.split('|')[1]
    console.log('dasldashjkdkasjhd', tableID)
    const tableData = await db.tables.findOne({ id: tableID })

    function renderUserData (userData: any, subTitle: string, referrerUsername: string): string {
        return `Роль: ${subTitle}
Ник: @${userData.username}
Имя пользователя: ${userData.from.first_name}
Пригласил: @${referrerUsername}
Лично приглашённых: ${userData?.referrals?.length || 0}\n\n`
    }

    if (tableData.techTitle === 'bronze') {
        const {
            layerOne,
            layerTwo
        } = await getBronzeDonwers(tableID)
        if (layerOne?.length) {
            let replyText = ''
            for (const userID of layerOne) {
                const userData = await db.users.findOne({ userID })
                const referrerData = await db.users.findOne({ userID: userData.referrerID })
                replyText += renderUserData(userData, '🟢Партнёр', referrerData?.username)
            }
            for (const userID of layerTwo) {
                const userData = await db.users.findOne({ userID })
                const referrerData = await db.users.findOne({ userID: userData.referrerID })
                replyText += renderUserData(userData, '🔵Даритель', referrerData?.username)
            }

            if (!replyText) return ctx.reply('Пользователи не найдены!')
            ctx.reply(replyText)
        }
    }
})
bot.callbackQuery(/render_photo/, async ctx => {
    const data = ctx.callbackQuery.data
    let tableID = data.split('|')[1] // Table ID will be changed to master table ID
    console.log(tableID)
    const userData = await db.users.findOne({ userID: ctx.from.id })
    const tableData = await db.tables.findOne({ id: tableID })

    const tableDowners = (await db.users.findOne(
        { [`tables.${tableData.techTitle}.id`]: tableID }
    )).tables?.[tableData.techTitle]?.downers
    let masterUsername
    if (tableDowners?.length < 3 || !tableDowners) {
        const masterData = await db.users.findOne({ userID: tableData.upper })
        tableID = masterData?.tables?.[tableData.techTitle]?.id
        masterUsername = masterData?.username
    }

    if (tableData?.techTitle === 'bronze') {
        const {
            layerOne,
            layerTwo
        } = await getBronzeDonwersForImage(tableID)
        const buffer = await renderBronzeTable(
            masterUsername || userData.username,
            layerOne,
            layerTwo
        )
        const file = new InputFile(buffer)
        await ctx.replyWithPhoto(file)
    } else {
        const buffer = await renderG3Table(
            tableData.techTitle,
            masterUsername || userData.username,
            await getUsernames(tableDowners)
        )
        const file = new InputFile(buffer)
        ctx.replyWithPhoto(file)
    }
    ctx.answerCallbackQuery()
})
bot.on('message:photo', ctx => {
    ctx.reply(JSON.stringify(ctx.msg, null, 2))
})
bot.on('message:document', ctx => {
    ctx.reply(JSON.stringify(ctx.msg.document, null, 2))
})
run(bot)
process.on('uncaughtException', console.error)
