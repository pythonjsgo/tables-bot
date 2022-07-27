import { InlineKeyboard, Keyboard } from 'grammy'
import { Menu, MenuRange } from '@grammyjs/menu'
import { BOT_URL, CHANNEL_URL, CHAT_URL, SUPPORT_URL, TABLES } from '../config.js'
import db, { setUserStep } from './db-manager.js'
import { MenuTemplate } from 'grammy-inline-menu'

export const accept = new InlineKeyboard()
    .text('✅Принять политику', 'accept')

export const start = new InlineKeyboard()
    .text('Начать', 'begin')

export const links = new InlineKeyboard()
    .url('Чат Galaxy', CHAT_URL)
    .url('Канал Galaxy', CHANNEL_URL)
    .text('Я подписался', 'subscribed-check')

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
    .text('Реферальная ссылка').row()

export const mainMenu0 = new Menu('main-menu')
    .submenu('💰Столы', 'tables', ctx => ctx.editMessageText('Мои столы')).row()
    .submenu('🧿Мой профиль', 'my-profile', async ctx => {
        const userID = ctx?.from?.id

        const userData = await db.users.findOne({ userID })
        ctx.editMessageText(`ID: <code>${ctx.from.id}</code>\n` +
            `<b>Приглашенных:</b> ${userData?.referrals?.length}\n` +
            `<b>Реферальная ссылка:</b> ${BOT_URL}?start=r${userID}`, {
            parse_mode: 'HTML'
        })
    }).row()
    .submenu('ℹ️О проекте', 'about-project', ctx => ctx.editMessageText('О проекте'))
export const tables = new Menu('tables')
    .dynamic(async (ctx) => {
        const userID = <number>ctx?.from?.id
        const range = new MenuRange()
        try {
            // const userData = await db.users.findOne({ userID: ctx?.from?.id })
            // for (const table in userData?.tables) {
            //     range.text({ text: 'table.title', payload: `table|${table || null}` }).row()
            // }
            const { tables } = await db.users.findOne({ userID })
            console.log('fhjsdgfjhsdgfjsjh', tables)
            for (const table of Object.values(tables)) {
                // @ts-ignore
                console.log('23i4yu2938478924798', table.id)
                // @ts-ignore
                const tableData: any = await db.tables.findOne({ id: table?.id })
                if (tableData?.title) {
                    range.text({
                        text: tableData.title,
                        // @ts-ignore
                        payload: `table|${table?.id}`
                    }).row()
                }
            }
        } catch (e) {
        }
        return range
    })
    .submenu('Открыть стол', 'tables-choice').row()

export const tablesChoice = new Menu('tables-choice')
    .dynamic(async (ctx) => {
        const userID = ctx?.from?.id
        const range = new MenuRange()
        const userData = await db.users.findOne({ userID })
        range.text({ text: '🚀Стартовый стол', payload: 'confirm_to_open_table|start' }).row()
        if (!userData?.tables?.bronzeTable) {
            range.text({
                text: '🥉️Бронзовый стол',
                payload: 'confirm_to_open_table|bronze'
            }).row()
        } else {
            range.text({
                text: '🟢🥉️Бронзовый стол',
                payload: 'done'
            }).row()
        }

        const tableLevel = userData?.tableLevel
        if (tableLevel >= 1) {
            range.text({
                text: '🥈️Серебряный стол',
                payload: 'confirm_to_open_table|silver'
            }).row()
        } else {
            range.text({
                text: '🥈Серебряный стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 2) {
            range.text({
                text: '🥇Золотой стол',
                payload: 'confirm_to_open_table|gold'
            }).row()
        } else {
            range.text({
                text: '🥇Золотой стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 3) {
            range.text({
                text: '🛡️Платиновый стол',
                payload: 'confirm_to_open_table|platinum'
            }).row()
        } else {
            range.text({
                text: '🛡️Платиновый стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 4) {
            range.text({
                text: '🔹️Сапфировый стол',
                payload: 'confirm_to_open_table|sapphire'
            }).row()
        } else {
            range.text({
                text: '🔹️Сапфировый стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 5) {
            range.text({
                text: '♦️Рубиновый стол',
                payload: 'confirm_to_open_table|ruby'
            }).row()
        } else {
            range.text({
                text: '♦️Рубиновый стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 6) {
            range.text({
                text: '❇️Изумрудный стол',
                payload: 'confirm_to_open_table|emerald'
            }).row()
        } else {
            range.text({
                text: '❇️Изумрудный стол',
                payload: 'locked'
            }).row()
        }
        if (tableLevel >= 7) {
            range.text({
                text: '💎️Бриллиантовый стол',
                payload: 'confirm_to_open_table|diamond'
            }).row()
        } else {
            range.text({
                text: '💎️Бриллиантовый стол',
                payload: 'locked'
            }).row()
        }

        return range
    })
    .back('🔙Назад')
tables.register(tablesChoice)
export const aboutProject = new Menu('about-project')
    .url('🆘Тех. поддержка', SUPPORT_URL).row()
    .text('Презентация', ctx => ctx.replyWithDocument('BQACAgIAAxkBAAIfBWLHfx922RM8IoovvAABWQz0zQZttwACbRsAAh2tOUo1_iRwhYybUykE')).row()
    .url('Чат Galaxy', CHAT_URL)
    .url('Канал Galaxy', CHANNEL_URL).row()
    .text('👁 GALAXY ИДЕОЛОГИЯ', ctx => ctx.reply('Galaxy bot - децентрализованная система дарения. Твоя галактическая история начинается со стартого стола. Собирая единомышленников, вам откроются новые возможности с уникальной системой построения команд. \n' +
        '\n' +
        'Наша цель - упростить ваш путь в Galaxy bot. Откройте новые лидерские качества, и поделись этой возможностью с окружающими тебя людьми. ')).row()
    .text('📖GALAXY ПРАВИЛА', ctx => ctx.reply('1️⃣ На 🚀Стартовом столе пользователь на уровне Партнёр делает подарок Мастеру стола 2000 руб., (это единственные вложения в проект). \n' +
        '\n' +
        '2️⃣ На уровне Партнер пользователь приглашает 3-х людей принять участие в проекте на 🚀Стартовом столе. \n' +
        '\n' +
        '3️⃣ После выполненных условий 🚀Стартого стола, у пользователя есть выбор, перейти на 🥉Бронзовый стол и сделать подарок Мастеру 5000 руб, и сделать подарок Аплайнеру 1000 руб. \n' +
        '\n' +
        '🥉️Бронзовый стол заполняется участниками из Вашей структуры (из числа приглашённых Вами), Вы ведете за собой структуру и стремитесь к закрытию стола и получению подарков.\n' +
        '\n' +
        'Чтобы перейти на столы выше, нужно выполнить условия, лично пригласить 3-х человек на 🚀Стартовый стол, далее перейти на🥉️Бронзовый стол. С умной реферальной ссылкой в Galaxy bot, можно помогать участникам, и закрывать квалификацию из 3-х человек. Тем самым, Вам будет легко вести свою команду к новым вершинам. ')).row()
    .text('🧑🏼‍🚀GALAXY РОЛИ', ctx => ctx.reply(`🔵️Даритель - дарит подарок

🟢️Партнёр - приглашает 3-х единомышленников (на 🚀Стартовый стол)

🟡️Мастер - получает подарки и активирует Партнера и Дарителя в системе`)).row()
    .text('🌐СТОЛЫ', ctx => ctx.reply('🚀Стартовый стол (В разработке)\n' +
        'Подарок 2000₽ \n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 6.000₽\n' +
        '\n' +
        '3 РОЛИ БРОНЗОВОГО СТОЛА\n' +
        '\n' +
        '🔵️Даритель - дарит подарок\n' +
        '\n' +
        '🟢️Партнёр - приглашает 3х единомышленников только на\n' +
        'На бронзовом столе\n' +
        '\n' +
        '🟡️Мастер - получает подарки и активирует дарителя в системе\n' +
        '\n' +
        '2 РОЛИ ПОСЛЕДУЮЩИХ СТОЛОВ\n' +
        '\n' +
        '🔵️Даритель\n' +
        '🟡️Мастер\n' +
        '\n' +
        '8 СТОЛОВ +1 в разработке \n' +
        '\n' +
        '\n' +
        '🥉️Бронзовый стол\n' +
        'Подарок «Мастеру» - 5000₽\n' +
        'Реферальный подарок «Пригласителю» - 1000₽\n' +
        '🎁️Вы получаете подарки от 9х человек на сумму - 45.000₽ + 3.000₽ (мин. реф. бонус)\n' +
        'Для перехода на серебро нужно пригласить от 3х «Дарителей»\n' +
        '\n' +
        '🥈️Серебряный стол\n' +
        'Подарок «Мастеру» - 25.000₽\n' +
        'Реферальный подарок «Пригласителю» - 5000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 75.000₽ + 15.000₽ (мин. реф. бонус)\n' +
        '\n' +
        '🥇️Золотой стол\n' +
        'Подарок «Мастеру» - 40.000₽\n' +
        'Реферальный подарок «Пригласителю»  - 10000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 120.000₽ + 30.000₽ (мин. реф. бонус)\n' +
        '\n' +
        '🛡️Платиновый стол\n' +
        'Подарок «Мастеру» - 80.000₽\n' +
        'Реферальный подарок «Пригласителю» - 20.000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 240.000₽ + 60.000 (мин. реф. бонус)\n' +
        '\n' +
        '🔹️Сапфировый стол\n' +
        'Подарок «Мастеру» - 160.000₽ \n' +
        'Реферальный подарок «Пригласителю» - 40.000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 480.000₽ + 120.000₽ (мин. реф. бонус)\n' +
        '\n' +
        '♦️Рубиновый стол\n' +
        'Подарок «Мастеру» - 320.000₽ \n' +
        'Реферальный подарок «Пригласителю» - 80.000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 960.000₽ + 240.000 (мин. реф. бонус)\n' +
        '\n' +
        '❇️Изумрудный стол\n' +
        'Подарок «Мастеру» - 640.000₽ \n' +
        'Реферальный подарок «Пригласителю» - 160.000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 1.920.000₽ + 480.000 (мин. реф. бонус)\n' +
        '\n' +
        '💎️Бриллиантовый стол\n' +
        'Подарок «Мастеру» - 1.280.000₽ \n' +
        'Реферальный подарок «Пригласителю» + 320.000₽\n' +
        '🎁️Вы получаете подарки от 3х человек на сумму - 3.840.000₽ + 960.000 (мин. реф. бонус)'))
const myProfile = new Menu('my-profile')
    .back('Назад', ctx => ctx.editMessageText('Главное меню'))

mainMenu0.register([tables, aboutProject, myProfile])

export const enterCode = new InlineKeyboard()
    .text('Ввести код', 'enterCode')
// Make it interactive.
// bot.use(menu);

export const table = new Menu('table')
    .text('Сделать 3 подарка', ctx => {
        ctx.editMessageText('Добро пожаловать\n' +
            'на стол ...\n' +
            'id стола ...\n' +
            '\n' +
            '*мастер\n' +
            '** ментор ')
    }).row()
    .text('❌Удалить аккаунт').row()
    .back('Назад')
tables.register(table)
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
    .text({ text: 'Назад' }, ctx => ctx.editMessageText('Мои столы')).row()

export const makeThreeGifts = new Menu('make-three-gifts')
    .text('Оповестить участников', ctx => {
        // notify members
        ctx.reply('✅Участники оповещены')
    })
    .back('Назад')

export const giftBuilder = (usernames: any, tableID: string = '', partners: any[] = [], gifters: any[] = []) => {
    console.log('tableIDWEgot', tableID)
    const keyboard = new InlineKeyboard()
    if (usernames) {
        for (const user of usernames) {
            // @ts-ignore
            if (!user?.name) continue
            keyboard.url(`🎁Сделать подарок @${user.name} (${user.amount})`, `t.me/${user.name}`).row()
        }
    }
    let partnerCount = 0
    let rowFactor = false
    for (const userID of partners) {
        keyboard.text(`🟢Партнер-${++partnerCount}`, `show_user|${userID}|${tableID}`)
        if (rowFactor) keyboard.row()
        rowFactor = !rowFactor
    }
    let gifterCount = 0
    for (const userID of gifters) {
        keyboard.text(`🔵Даритель-${++gifterCount}`, `show_user|${userID}`)
        if (rowFactor) keyboard.row()
        rowFactor = !rowFactor
    }
    if (usernames) {
        keyboard.text('🔔Оповестить участников', `notify-members|${tableID}`).row()
    }
    // keyboard.text('')
    keyboard.text('🗄Показать команду списком', `show_users_list|${tableID}`).row()
    keyboard.text('🌠Показать стол картинкой', `render_photo|${tableID}`).row()
    keyboard.text('❌Удалить стол', `left_table|${tableID}`).row()
    keyboard.text('🔙Назад', 'back|my-tables')
    return keyboard
}
export const confirmGift = (data: string) => {
    const keyboard = new InlineKeyboard()
    keyboard.text('✅Подтвердить', `accept|${data}`)
    keyboard.text('❌Отклонить', `decline|${data}`)
    return keyboard
}

export const deleteAccount = new InlineKeyboard()
    .text('❌Удалить аккаунт', 'delete_my_account')

export const showUsersList = (tableID: string) => new InlineKeyboard()
    .text('Показать списком', `show_users_list|${tableID}`)
export const inviteUsersForwardLink = (text: string) => new InlineKeyboard().switchInline('testText', 'testQuery')

export const confirmationWithAction = (data: string) => new InlineKeyboard()
export const writeAndHide = (username: string) => new InlineKeyboard()
    .url('✈️Написать', `t.me/${username}`).row()
    .text('❌Скрыть', 'hide')

export const openTableOrHide = (tableTitle: string) => new InlineKeyboard()
    .text('🔓Открыть стол', `open_table|${tableTitle}`)
    .text('❌Отмена', 'hide')

export const profileButton = new InlineKeyboard()
    .text('🏆Моя первая линия', 'my_first_line')
// YEhpR

export const createSpecialReferralLink = new InlineKeyboard()
    .text('Создать реф. ссылку', 'create-special-ref-link')

export const deleteUserFromTable = (userID = 0, tableID = '') =>
    new InlineKeyboard()
        .text('❌Удалить со стола', `remove_from_table|${userID},${tableID}`)
