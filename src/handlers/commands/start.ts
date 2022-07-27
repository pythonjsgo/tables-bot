import { NextFunction } from 'grammy'
import db, { setUserValue } from '../../db-manager.js'
import * as keyboards from '../../keyboards.js'

export default async (ctx: any, next: NextFunction) => {
    const userID = <number>ctx?.from?.id
    const text = ctx.msg.text
    const userData = await db.users.findOne({ userID })
    if (!userData?.username) {
        await db.users.updateOne(
            { userID },
            {
                $set: {
                    userID,
                    username: ctx.from.username,
                    from: ctx.from
                }
            },
            { upsert: true }
        )
    }
    console.log('startsjklkdfj')
    try {
        const payloadData = text.split(' ')[1]
        console.log(payloadData)
        const sIndex: number = payloadData.indexOf('s')
        console.log(sIndex)
        let referralID: number
        if (sIndex > 0) {
            referralID = parseInt(payloadData?.slice(1, sIndex))
        } else referralID = parseInt(payloadData?.slice(1))
        console.log(referralID)
        if (payloadData.includes('s')) {
            const superReferrerID = parseInt(payloadData.slice(sIndex + 1))
            console.log(superReferrerID, 'jkdfhkjfdskljf')
            await setUserValue(userID, 'superReferrerID', superReferrerID)
        }
        if (payloadData[0] === 'r') {
            await setUserValue(userID, 'referrerID', referralID)
            db.users.findOne({ userID: referralID }).then((r: any) => {
                db.users.updateOne({ userID }, {
                    $set: {
                        fraction: r.fraction
                    }
                }, {
                    upsert: true
                })
            })
            await ctx.reply('Реферальный код успешно задан!', { reply_markup: { remove_keyboard: true } })
        }
    } catch (e) {
        // console.error(e)
    }

    if (!userData?.accepted || !userData?.referrerID) {
        ctx.reply('<a href="telegra.ph/Polzovatelskoe-soglashenie-Galaxy-i-politika-konfidencialnosti-06-19">' +
            'Пользовательское соглашение Galaxy и политика конфиденциальности' +
            '</a>\n', {
            reply_markup: keyboards.accept,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    } else {
        ctx.reply('<b>Добро пожаловать в меню</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: keyboards.mainMenu.build()
            },
            parse_mode: 'HTML'
        })
    }
}
