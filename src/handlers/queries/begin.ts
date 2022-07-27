import db, { setUserStep } from '../../db-manager.js'
import * as keyboards from '../../keyboards.js'
import { addAbortSignal } from 'stream'

export default async (ctx: any) => {
    const userData = await db.users.findOne({ userID: ctx.from.id })
    if (!userData?.referrerID) {
        return ctx.editMessageText('Введите свой реферальный код  пригласившего или перейдите по ссылке', { reply_markup: keyboards.enterCode })
    }
    const referrerData = await db.users.findOne({ userID: userData?.referrerID })
    await ctx.editMessageText(`Ваш ID: <code>${ctx.from.id}</code>
<b>Ваш ник:</b> @${userData.username}

<b>Вас пригласил:</b>  @${referrerData?.username}
<b>Лично приглашённых:</b> 0
<b>Ваши столы:</b>

🥉Бронзовый стол ещё не выбран

<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>`, { reply_markup: keyboards.links, parse_mode: 'HTML' }
    )
    await setUserStep(ctx.from.id, 'subscribe-locker')
    //     await ctx.editMessageText('<b>Вы успешно зарегистрировались\n</b>' +
    //         `ID: <code>${ctx.from.id}</code>
    // Вас пригласил: ${userData.referrerID}\n
    // Приглашенные: ${userData?.referrals?.length || 0}
    // Стол ещё не выбран, у вас есть 24 часа....`, {
    //         reply_markup: keyboards.links, parse_mode: 'HTML'
    //     })

    setTimeout(() => {
        ctx.reply('<b>Главное меню</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: keyboards.mainMenu.build()
            },
            parse_mode: 'HTML'
        })
    }, 2000)
}
