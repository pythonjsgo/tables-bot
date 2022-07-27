import { InlineKeyboard, Keyboard } from 'grammy';
import { Menu, MenuRange } from '@grammyjs/menu';
import { BOT_URL, CHANNEL_URL, CHAT_URL, SUPPORT_URL } from '../config.js';
import db from './db-manager.js';
export const accept = new InlineKeyboard()
    .text('✅Принять политику', 'accept');
export const start = new InlineKeyboard()
    .text('Начать', 'begin');
export const links = new InlineKeyboard()
    .url('Чат Galaxy', CHAT_URL)
    .url('Канал Galaxy', CHANNEL_URL)
    .text('Я подписался', 'subscribed-check');
/* Template
export const mainMenu = new InlineKeyboard()
    .text('💰Столы', 'tabels').row()
    .text('🧿Мой профиль', 'my-profile').row()
    .text('ℹ️О проекте', 'about')
 */
export const mainMenu = new Keyboard()
    .text('Открыть стол').row()
    .text('Мой профиль').row()
    .text('️О проекте').row()
    .text('Реферальная ссылка').row();
export const mainMenu0 = new Menu('main-menu')
    .submenu('💰Столы', 'tables', ctx => ctx.editMessageText('Мои столы')).row()
    .submenu('🧿Мой профиль', 'my-profile', async (ctx) => {
    const userID = ctx?.from?.id;
    const userData = await db.users.findOne({ userID });
    ctx.editMessageText(`ID: <code>${ctx.from.id}</code>\n` +
        `<b>Приглашенных:</b> ${userData?.referrals?.length}\n` +
        `<b>Реферальная ссылка:</b> ${BOT_URL}?start=r${userID}`, {
        parse_mode: 'HTML'
    });
}).row()
    .submenu('ℹ️О проекте', 'about-project', ctx => ctx.editMessageText('О проекте'));
export const tables = new Menu('tables')
    .dynamic(async (ctx) => {
    const userID = ctx?.from?.id;
    const range = new MenuRange();
    try {
        // const userData = await db.users.findOne({ userID: ctx?.from?.id })
        // for (const table in userData?.tables) {
        //     range.text({ text: 'table.title', payload: `table|${table || null}` }).row()
        // }
        const { tables } = await db.users.findOne({ userID });
        console.log('fhjsdgfjhsdgfjsjh', tables);
        for (const table of Object.values(tables)) {
            // @ts-ignore
            console.log('23i4yu2938478924798', table.id);
            // @ts-ignore
            const tableData = await db.tables.findOne({ id: table?.id });
            if (tableData?.title) {
                range.text({
                    text: tableData.title,
                    // @ts-ignore
                    payload: `table|${table?.id}`
                }).row();
            }
        }
    }
    catch (e) {
    }
    return range;
})
    .submenu('Открыть стол', 'tables-choice').row();
export const tablesChoice = new Menu('tables-choice')
    .dynamic(async (ctx) => {
    const userID = ctx?.from?.id;
    const range = new MenuRange();
    const userData = await db.users.findOne({ userID });
    if (!userData?.tables?.bronzeTable) {
        range.text({
            text: '🥉️Бронзовый стол',
            payload: 'confirm_to_open_table|bronze'
        }).row();
    }
    else {
        range.text({
            text: '🟢🥉️Бронзовый стол',
            payload: 'done'
        }).row();
    }
    const tableLevel = userData?.tableLevel;
    if (tableLevel >= 1) {
        range.text({
            text: '🥈️Серебряный стол',
            payload: 'confirm_to_open_table|silver'
        }).row();
    }
    else {
        range.text({
            text: '🥈Серебряный стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 2) {
        range.text({
            text: '🥇Золотой стол',
            payload: 'confirm_to_open_table|gold'
        }).row();
    }
    else {
        range.text({
            text: '🥇Золотой стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 3) {
        range.text({
            text: '🛡️Платиновый стол',
            payload: 'confirm_to_open_table|platinum'
        }).row();
    }
    else {
        range.text({
            text: '🛡️Платиновый стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 4) {
        range.text({
            text: '🔹️Сапфировый стол',
            payload: 'confirm_to_open_table|sapphire'
        }).row();
    }
    else {
        range.text({
            text: '🔹️Сапфировый стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 5) {
        range.text({
            text: '♦️Рубиновый стол',
            payload: 'confirm_to_open_table|ruby'
        }).row();
    }
    else {
        range.text({
            text: '♦️Рубиновый стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 6) {
        range.text({
            text: '❇️Изумрудный стол',
            payload: 'confirm_to_open_table|emerald'
        }).row();
    }
    else {
        range.text({
            text: '❇️Изумрудный стол',
            payload: 'locked'
        }).row();
    }
    if (tableLevel >= 7) {
        range.text({
            text: '💎️Бриллиантовый стол',
            payload: 'confirm_to_open_table|diamond'
        }).row();
    }
    else {
        range.text({
            text: '💎️Бриллиантовый стол',
            payload: 'locked'
        }).row();
    }
    return range;
})
    .back('🔙Назад');
tables.register(tablesChoice);
export const aboutProject = new Menu('about-project')
    .url('🆘Тех. поддержка', SUPPORT_URL).row()
    .text('Презентация', ctx => ctx.replyWithDocument('https://theses.cz/id/coz94g/35205-772556954.pdf')).row();
const myProfile = new Menu('my-profile')
    .back('Назад', ctx => ctx.editMessageText('Главное меню'));
mainMenu0.register([tables, aboutProject, myProfile]);
export const enterCode = new InlineKeyboard()
    .text('Ввести код', 'enterCode');
// Make it interactive.
// bot.use(menu);
export const table = new Menu('table')
    .text('Сделать 3 подарка', ctx => {
    ctx.editMessageText('Добро пожаловать\n' +
        'на стол ...\n' +
        'id стола ...\n' +
        '\n' +
        '*мастер\n' +
        '** ментор ');
}).row()
    .text('❌Удалить аккаунт').row()
    .back('Назад');
tables.register(table);
export const tableDone = new Menu('table-done')
    .text({
    text: 'Команда списком',
    payload: 'commands_list'
}, ctx => {
}).row()
    .text({
    text: 'Посмотреть дарителей',
    payload: 'show_lister'
}).row()
    .text({ text: 'Назад' }, ctx => ctx.editMessageText('Мои столы')).row();
export const makeThreeGifts = new Menu('make-three-gifts')
    .text('Оповестить участников', ctx => {
    // notify members
    ctx.reply('✅Участники оповещены');
})
    .back('Назад');
export const giftBuilder = (usernames, tableID = '', partners = [], gifters = []) => {
    console.log('tableIDWEgot', tableID);
    const keyboard = new InlineKeyboard();
    if (usernames) {
        for (const user of usernames) {
            // @ts-ignore
            if (!user?.name)
                continue;
            keyboard.url(`🎁Сделать подарок @${user.name} (${user.amount})`, `t.me/${user.name}`).row();
        }
    }
    let partnerCount = 0;
    let rowFactor = false;
    for (const userID of partners) {
        keyboard.text(`🟢Партнер-${++partnerCount}`, `show_user|${userID}`);
        if (rowFactor)
            keyboard.row();
        rowFactor = !rowFactor;
    }
    let gifterCount = 0;
    for (const userID of gifters) {
        keyboard.text(`🔵Даритель-${++gifterCount}`, `show_user|${userID}`);
        if (rowFactor)
            keyboard.row();
        rowFactor = !rowFactor;
    }
    if (usernames) {
        keyboard.text('🔔Оповестить участников', `notify-members|${tableID}`).row();
    }
    // keyboard.text('')
    keyboard.text('🗄Показать команду списком', `show_users_list|${tableID}`).row();
    keyboard.text('🌠Показать стол картинкой', `render_photo|${tableID}`);
    keyboard.text('🔙Назад', 'back|my-tables');
    return keyboard;
};
export const confirmGift = (data) => {
    const keyboard = new InlineKeyboard();
    keyboard.text('✅Подтвердить', `accept|${data}`);
    keyboard.text('❌Отклонить', `decline|${data}`);
    return keyboard;
};
export const deleteAccount = new InlineKeyboard()
    .text('❌Удалить аккаунт', 'delete_my_account');
export const showUsersList = (tableID) => new InlineKeyboard()
    .text('Показать списком', `show_users_list|${tableID}`);
export const inviteUsersForwardLink = (text) => new InlineKeyboard().switchInline('testText', 'testQuery');
export const confirmationWithAction = (data) => new InlineKeyboard();
export const writeAndHide = (username) => new InlineKeyboard()
    .url('✈️Написать', `t.me/${username}`).row()
    .text('❌Скрыть', 'hide');
export const openTableOrHide = (tableTitle) => new InlineKeyboard()
    .text('🔓Открыть стол', `open_table|${tableTitle}`)
    .text('❌Отмена', 'hide');
export const profileButton = new InlineKeyboard()
    .text('🏆Моя первая линия', 'my_first_line');
// YEhpR
export const createSpecialReferralLink = new InlineKeyboard()
    .text('Создать реф. ссылку', 'create-special-ref-link');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tleWJvYXJkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQVUsTUFBTSxjQUFjLENBQUE7QUFDbEYsT0FBTyxFQUFtQixNQUFNLGlCQUFpQixDQUFBO0FBR2pELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsRUFBRTtLQUNyQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFFeEMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBYyxFQUFFO0tBQ3BDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFFNUIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBYyxFQUFFO0tBQ3BDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDO0tBQzNCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDO0tBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUU3Qzs7Ozs7R0FLRztBQUVILE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRTtLQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFO0tBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUU7S0FDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRTtLQUN4QixJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUVyQyxNQUFNLENB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