// LSD-25 Powered code
import { Bot, InputFile, session } from 'grammy';
import { run } from '@grammyjs/runner';
import { BOT_URL, TABLE_PHOTO_FILE_ID, TABLES, TOKEN } from '../config.js';
import { confirmGift, createSpecialReferralLink, openTableOrHide, table, tables } from './keyboards.js';
import startHandler from './handlers/commands/start.js';
import acceptHandler from './handlers/queries/accept.js';
import userChecker from './middlewares/userChecker.js';
import beginHandler from './handlers/queries/begin.js';
import tablesHandlers from './handlers/hears/tables.js';
import profileHandler from './handlers/hears/profile.js';
import aboutProjectHandler from './handlers/hears/about.js';
import mustBeAdmin from './middlewares/mustBeAdmin.js';
import adminHandler from './handlers/commands/admin.js';
import lockedHandler from './handlers/queries/locked.js';
import enterCodeHandler from './handlers/queries/enter-code.js';
import tableHandler from './handlers/queries/table.js';
import { middleware as openTableHandler } from './handlers/queries/open-table.js';
import { middleware as tablesMiddleware } from './menues/tables.js';
import db, { setUserStep } from './db-manager.js';
import { router } from './routers/get.js';
import { getBronzeDonwers, getBronzeDonwersForImage, getTodayDate, getUsernames, parseTableIdFromCbQuery } from './logic.js';
import { renderBronzeTable, renderG3Table } from '../render.js';
export const bot = new Bot(TOKEN);
// DEV
// @ts-ignore
bot.use(session());
bot.use((ctx, next) => {
    const userID = ctx?.from?.id;
    // @ts-ignore
    if (userID > 0) {
        next();
    }
});
bot.use(tablesMiddleware);
bot.command(['d', 'delete_proof'], ctx => {
    db.users.deleteMany({ userID: ctx?.from?.id });
    db.tables.deleteMany({ owner: ctx?.from?.id });
    ctx.reply('+', { reply_markup: { remove_keyboard: true } }).then(message => {
        ctx.api.deleteMessage(ctx?.from?.id, message.message_id);
    });
});
// bot.use((ctx, next) => {
//     if ([1560854919, 1719482730, 882079062, 5173696049].includes(<number>ctx?.from?.id)) {
//         next()
//     } else ctx.reply('Проект в разработке!')
// })
// Every callbackQuery logger
bot.on('callback_query', (ctx, next) => {
    console.log(ctx.callbackQuery.data);
    return next();
});
bot.use(userChecker);
bot.command('start', startHandler);
bot.use(router);
bot.use(tables);
bot.use(table);
bot.command('admin', mustBeAdmin, adminHandler);
bot.callbackQuery('accept', acceptHandler);
bot.callbackQuery('begin', beginHandler);
bot.callbackQuery('enterCode', enterCodeHandler);
bot.hears('Открыть стол', tablesHandlers);
bot.hears('Мой профиль', profileHandler);
bot.hears('️О проекте', aboutProjectHandler);
bot.callbackQuery(/done/, ctx => ctx.answerCallbackQuery({ text: 'Стол уже был открыт!' }));
bot.callbackQuery(/locked/, lockedHandler);
bot.callbackQuery(/confirm_to_open_table\|/, ctx => {
    const data = ctx.callbackQuery.data;
    const techTitle = parseTableIdFromCbQuery(data);
    // @ts-ignore
    const tableMeta = TABLES[techTitle];
    /*
    Добро пожаловать на
🥉 Бронзовый стол (12.04.2022)
ID стола: 76a11fd6-5644

🧑🏼Вы дарите денежный
🎁 подарок 5.000₽ «Мастеру» и 1.000₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)
     */
    ctx.editMessageCaption({
        caption: `   
Добро пожаловать на
${tableMeta.title} (${getTodayDate()})
        
🏼Вы дарите денежный
🎁 подарок ${tableMeta.masterGift}₽ «Мастеру» и ${tableMeta.referrerGift}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)
${tableMeta.title}?`,
        reply_markup: openTableOrHide(techTitle)
    });
});
bot.callbackQuery(/open_table/, openTableHandler);
bot.callbackQuery('my_first_line', async (ctx) => {
    ctx.answerCallbackQuery();
    const userID = ctx?.from?.id;
    const userData = await db.users.findOne({ userID });
    let replyText = '';
    for (const referralID of userData?.referrals) {
        const referralData = await db.users.findOne({ userID: referralID });
        let tableTitle = '🥉Бронзовый стол';
        // @ts-ignore
        console.log(Object.values(TABLES)[6]);
        if (referralData?.tableLevel) {
            if (userData.tableLevel > 8)
                userData.tableLevel = 7;
            tableTitle = Object.values(TABLES)[userData?.tableLevel].title;
        }
        replyText += `Стол: ${tableTitle}
Ник: ${referralData.username}
Имя пользователя: ${referralData?.from?.first_name}
Лично приглашённых: ${referralData?.referrals?.length || 0}\n\n`;
    }
    ctx.reply(replyText);
});
bot.callbackQuery(/notify-members/, async (ctx) => {
    const data = ctx.callbackQuery.data;
    const text = ctx.msg.text || ctx.msg.caption;
    const userID = ctx.from.id;
    const tableID = data.split('|')[1];
    const tableData = await db.tables.findOne({ id: tableID });
    ctx.editMessageReplyMarkup();
    for (const gift of tableData.gifts) {
        ctx.api.sendMessage(gift.to, `🎉<b>Пользователь @${ctx.from.username} отправил вам подарок</b>
На сумму <i>${gift.amount}₽</i>`, {
            parse_mode: 'HTML',
            reply_markup: confirmGift(tableID)
        });
    }
    ctx.reply('Отправлено!');
});
bot.callbackQuery(/accept/, async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userID = ctx.from.id;
    const tableID = data.split('|')[1];
    console.log(tableID, 'to be accepted');
    await db.tables.updateOne({
        id: tableID,
        gifts: {
            $elemMatch: {
                to: userID,
                status: { $exists: false }
            }
        }
    }, {
        $set: {
            'gifts.$.status': 'confirmed'
        }
    }, {
        upsert: true
    });
    const tableData = await db.tables.findOne({ id: tableID });
    if (tableData.gifts.filter((i) => i.status === 'confirmed')?.length === tableData.gifts.length) {
        const data = await (db.tables.findOneAndUpdate({
            $and: [
                { owner: tableData.upper },
                { techTitle: tableData.techTitle }
            ]
        }, {
            $inc: { toUnlockNextTableCounter: 1 }
        }, { upsert: true })).value;
        if (data?.toUnlockNextTableCounter >= 3) {
            db.users.updateOne({ userID: data.owner }, {
                $inc: {
                    tableLevel: 1
                }
            }, { upsert: true });
            ctx.api.sendMessage(data.owner, '<b>🎉Разблокирован новый уровень стола!</b>', { parse_mode: 'HTML' });
        }
        db.tables.updateOne({ id: tableID }, { $set: { status: 'gifted' } });
        db.users.updateOne({ userID: tableData.owner }, {
            $set: { referralsAllowed: true }
        }, { upsert: true }).then((r) => {
            if (r.modifiedCount)
                ctx.api.sendMessage(tableData.owner, '✅Реферальная система разблокирована!');
        });
    }
    ctx.api.sendMessage(tableData.owner, `✅Пользователь @${ctx.from.username} подтвердил получение вашего подарка!`);
    ctx.editMessageText('✅Подарок успешно подтвержден!');
});
bot.callbackQuery(/decline/, async (ctx) => {
    const data = ctx.callbackQuery.data;
    console.log(data);
    const tableID = data.split('|')[1];
    console.log(tableID);
    const tableData = await db.tables.findOne({ id: tableID });
    ctx.api.sendMessage(tableData.owner, `❌ @${ctx.from.username} отклонил подтверждение подарка!`);
    ctx.editMessageText('❌Подарок отклонен!');
});
bot.hears('Реферальная ссылка', async (ctx) => {
    const userID = ctx?.from?.id;
    const userData = await db.users.findOne({ userID });
    if (userData?.referralsAllowed) {
        ctx.reply(`
Чтобы зарегистрировать под себя человека скопируйте реф. ссылку или реф. код
<b>Ваша реферальная ссылка</b> - ${BOT_URL}?start=r${userID}
Ваш реферальный код: <code>${userID}</code>`, {
            reply_markup: createSpecialReferralLink,
            parse_mode: 'HTML'
        });
    }
    else {
        ctx.reply(`<b>❌Реферальная система закрыта</b>
Для получения реферальной ссылки необходимо сделать подарки в первом столе`, { parse_mode: 'HTML' });
    }
});
bot.callbackQuery('create-special-ref-link', async (ctx) => {
    const userID = ctx.from.id;
    setUserStep(userID, 'get-ref-username');
    ctx.reply('<b>Отправьте имя пользователя для которого необходимо создать реф. ссылку:</b>', { parse_mode: 'HTML' });
});
bot.callbackQuery('delete_my_account', async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply('🛑Для подтверждения удаления аккаунта отправьте команду /delete_proof в чат');
});
bot.callbackQuery(/back/, ctx => {
    const data = ctx.callbackQuery.data.split('|')[1];
    if (data === 'my-tables') {
        ctx.editMessageMedia({
            type: 'photo',
            media: TABLE_PHOTO_FILE_ID,
            caption: 'Мои столы',
            parse_mode: 'HTML'
        }, {
            reply_markup: tables
        });
    }
});
bot.callbackQuery(/table/, tableHandler);
bot.callbackQuery(/show_user\|/, async (ctx) => {
    ctx.answerCallbackQuery();
    const data = ctx.callbackQuery.data;
    const userToFindID = Number(data.split('|')[1]);
    const userData = await db.users.findOne({ userID: userToFindID });
    const referrerData = await db.users.findOne({ userID: userData?.referrerID });
    ctx.reply(`<i>🔎Информация о пользователе</i>
        <b>Ник:</b> @${userData?.username}
        <b>Имя пользователя:</b> ${userData?.from?.first_name}
        <b>Пригласил:</b> @${referrerData?.username}
        <b>Лично приглашённых:</b> ${userData?.referrals?.length || 0}`, {
        parse_mode: 'HTML'
    });
});
bot.callbackQuery(/hide/, ctx => ctx.deleteMessage());
bot.callbackQuery(/show_users_list\|/, async (ctx) => {
    const userID = ctx?.from?.id;
    const data = ctx.callbackQuery.data;
    const tableID = data.split('|')[1];
    console.log('dasldashjkdkasjhd', tableID);
    const tableData = await db.tables.findOne({ id: tableID });
    function renderUserData(userData, subTitle, referrerUsername) {
        return `Роль: ${subTitle}
Ник: @${userData.username}
Имя пользователя: ${userData.from.first_name}
Пригласил: @${referrerUsername}
Лично приглашённых: ${userData?.referrals?.length || 0}\n\n`;
    }
    if (tableData.techTitle === 'bronze') {
        const { layerOne, layerTwo } = await getBronzeDonwers(tableID);
        if (layerOne?.length) {
            let replyText = '';
            for (const userID of layerOne) {
                const userData = await db.users.findOne({ userID });
                const referrerData = await db.users.findOne({ userID: userData.referrerID });
                replyText += renderUserData(userData, '🟢Партнёр', referrerData?.username);
            }
            for (const userID of layerTwo) {
                const userData = await db.users.findOne({ userID });
                const referrerData = await db.users.findOne({ userID: userData.referrerID });
                replyText += renderUserData(userData, '🔵Даритель', referrerData?.username);
            }
            if (!replyText)
                return ctx.reply('Пользователи не найдены!');
            ctx.reply(replyText);
        }
    }
});
bot.callbackQuery(/render_photo/, async (ctx) => {
    // const buffer = await renderG3Table(techTitle, userData.username, await getUsernames(table.downers))
    // const file = new InputFile(buffer)
    // type: 'photo',
    //     media: file,
    // const buffer = await renderBronzeTable(
    //     userData.username,
    //     await getUsernames(layerOne),
    //     await getUsernames(layerTwo)
    // )
    // const file = new InputFile(buffer)
    const data = ctx.callbackQuery.data;
    const tableID = data.split('|')[1];
    console.log(tableID);
    const userData = await db.users.findOne({ userID: ctx.from.id });
    const tableData = await db.tables.findOne({ id: tableID });
    const tableDowners = (await db.users.findOne({ [`tables.${tableData.techTitle}.id`]: tableID })).tables?.[tableData.techTitle]?.downers;
    if (tableData?.techTitle === 'bronze') {
        const { layerOne, layerTwo } = await getBronzeDonwersForImage(tableID);
        const buffer = await renderBronzeTable(userData.username, layerOne, layerTwo);
        const file = new InputFile(buffer);
        await ctx.replyWithPhoto(file);
    }
    else {
        const buffer = await renderG3Table(tableData.techTitle, userData.username, await getUsernames(tableDowners));
        const file = new InputFile(buffer);
        ctx.replyWithPhoto(file);
    }
    ctx.answerCallbackQuery();
});
bot.on('message:photo', ctx => {
    ctx.reply(JSON.stringify(ctx.msg, null, 2));
});
run(bot);
process.on('uncaughtException', console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUN0QixPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFDaEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGtCQUFrQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLHlCQUF5QixFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDdkcsT0FBTyxZQUFZLE1BQU0sOEJBQThCLENBQUE7QUFDdkQsT0FBTyxhQUFhLE1BQU0sOEJBQThCLENBQUE7QUFDeEQsT0FBTyxXQUFXLE1BQU0sOEJBQThCLENBQUE7QUFDdEQsT0FBTyxZQUFZLE1BQU0sNkJBQTZCLENBQUE7QUFDdEQsT0FBTyxjQUFjLE1BQU0sNEJBQTRCLENBQUE7QUFDdkQsT0FBTyxjQUFjLE1BQU0sNkJBQTZCLENBQUE7QUFDeEQsT0FBTyxtQkFBbUIsTUFBTSwyQkFBMkIsQ0FBQTtBQUMzRCxPQUFPLFdBQVcsTUFBTSw4QkFBOEIsQ0FBQTtBQUN0RCxPQUFPLFlBQVksTUFBTSw4QkFBOEIsQ0FBQTtBQUN2RCxPQUFPLGFBQWEsTUFBTSw4QkFBOEIsQ0FBQTtBQUN4RCxPQUFPLGdCQUFnQixNQUFNLGtDQUFrQyxDQUFBO0FBQy9ELE9BQU8sWUFBWSxNQUFNLDZCQUE2QixDQUFBO0FBQ3RELE9BQU8sRUFBRSxVQUFVLElBQUksZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQTtBQUNqRixPQUFPLEVBQUUsVUFBVSxJQUFJLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDbkUsT0FBTyxFQUFF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