import { Router } from '@grammyjs/router'
import db, { getUserStep, setUserStep } from '../db-manager.js'
import * as keyboards from '../keyboards.js'
import { BOT_URL, CHANNEL_ID, CHAT_ID } from '../../config.js'
import { uptime } from 'os'

export const router = new Router(async (ctx: any) => {
    return await getUserStep(ctx.from.id)
})

async function userExists (userID: number) {
    return Boolean(await db.users.findOne({ userID }))
}

router.route('get-ref-code', async (ctx: any) => {
    const userID: number = ctx.from.id
    const referralCode = Number(ctx.msg.text)
    console.log(referralCode)
    if (await userExists(referralCode)) {
        db.users.updateOne({ userID }, { $set: { referrerID: referralCode } })
        db.users.findOne({ userID: referralCode }).then((r: any) => {
            db.users.updateOne({ userID }, {
                $set: {
                    fraction: r.fraction
                }
            }, {
                upsert: true
            })
        })
        await ctx.reply('🟢Код успешно установлен!')
        const userData = await db.users.findOne({ userID })
        const referrerData = await db.users.findOne({ userID: userData?.referrerID })
        await ctx.reply(`Ваш ID: <code>${ctx.from.id}</code>
<b>Ваш ник:</b> @${userData.username}

<b>Вас пригласил:</b>  @${referrerData.username}
<b>Лично приглашённых:</b> 0
<b>Ваши столы:</b>

🥉Бронзовый стол ещё не выбран

<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>`, {
            reply_markup: keyboards.links,
            parse_mode: 'HTML'
        }
        )
        await setUserStep(ctx.from.id, 'subscribe-locker')
        await ctx.reply('<b>Главное меню</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: keyboards.mainMenu.build()
            },
            parse_mode: 'HTML'
        })
    } else {
        ctx.reply('❌Неверный реферальный код!')
    }
}
)

router.route('subscribe-locker', async (ctx: any) => {
    const userID: number = ctx.from.id
    // checking
    const checks = []
    try {
        checks.push(
            await ctx.api.getChatMember(CHANNEL_ID, userID),
            await ctx.api.getChatMember(CHAT_ID, userID)
        )
    } catch (e) {
        setUserStep(userID)
        return ctx.reply('Подписка подтверждена по тех. причинам!')
    }
    console.log(checks)
    console.log(checks.filter(i => i.status !== 'left'))
    if (checks.filter(i => i.status !== 'left').length === 2) {
        setUserStep(userID)
        return ctx.reply('Подписка подтверждена!')
    }
    ctx.reply('<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>',
        {
            reply_markup: keyboards.links,
            parse_mode: 'HTML'
        }
    )
})

router.route('get-ref-username', async (ctx: any) => {
    const userID: number = ctx.from.id

    const username = ctx.msg.text.replace('@', '')
    const specialReferralUserData = await db.users.findOne({ username })

    if (specialReferralUserData) {
        ctx.reply(
            `<b>🪄Реферальная ссылка сгенерирована ${BOT_URL}?start=r${specialReferralUserData.userID}s${userID}</b>`, {
                parse_mode: 'HTML'
            }
        )
        setUserStep(userID)
    } else {
        setUserStep(userID)
        ctx.reply('<b>❌Пользователь не найден</b>',
            { parse_mode: 'HTML' })
    }
})
