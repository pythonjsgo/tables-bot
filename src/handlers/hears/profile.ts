import { NextFunction } from 'grammy'
import { BOT_URL } from '../../../config.js'
import db from '../../db-manager.js'
import { deleteAccount, profileButton } from '../../keyboards.js'
import { get3GDowners, getBronzeDonwers } from '../../logic.js'

export default async (ctx: any, next: NextFunction) => {
    const userID = ctx?.from?.id
    const userData = await db.users.findOne({ userID })
    //  `<b>Реферальная ссылка:</b> ${BOT_URL}?start=r${userID}
    const referrerUsername = (await db.users.findOne({ userID: userData?.referrerID }))?.username
    let replyText = `<b>Ваш ID:</b> <code>${userID}</code> 
<b>Ваш ник:</b> @${userData?.username}

<b>Вас пригласил:</b> @${referrerUsername}
<b>Лично приглашённых:</b> ${userData?.referrals?.length | 0}
<b>Ваши столы:</b>\n`

    let index = 0
    if (userData?.tables) {
        for (const table of Object.values(userData.tables)) {
            // @ts-ignore-start
            replyText += `\n\n<b>${table.title}</b>\n`

            // @ts-ignore
            replyText += `🟢Всего партнеров на столе: ${table?.downers?.length | 0}`
            if (index === 0) {
                // @ts-ignore
                const {
                    layerOne,
                    layerTwo
                    // @ts-ignore
                } = await getBronzeDonwers(table.id)
                replyText += `\n🔵Всего дарителей на столе: ${layerTwo?.length | 0}`
            }
            // @ts-ignore
            index++
            // @ts-ignore-end
        }
    } else {
        replyText += '\n<b>Столы не открыты</b>'
    }

    ctx.reply(replyText, {
        reply_markup: profileButton,
        parse_mode: 'HTML'
    })
}
