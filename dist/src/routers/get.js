import { Router } from '@grammyjs/router';
import db, { getUserStep, setUserStep } from '../db-manager.js';
import * as keyboards from '../keyboards.js';
import { BOT_URL, CHANNEL_ID, CHAT_ID } from '../../config.js';
export const router = new Router(async (ctx) => {
    return await getUserStep(ctx.from.id);
});
async function userExists(userID) {
    return Boolean(await db.users.findOne({ userID }));
}
router.route('get-ref-code', async (ctx) => {
    const userID = ctx.from.id;
    const referralCode = Number(ctx.msg.text);
    console.log(referralCode);
    if (await userExists(referralCode)) {
        db.users.updateOne({ userID }, { $set: { referrerID: referralCode } });
        db.users.findOne({ userID: referralCode }).then((r) => {
            db.users.updateOne({ userID }, {
                $set: {
                    fraction: r.fraction
                }
            }, {
                upsert: true
            });
        });
        await ctx.reply('🟢Код успешно установлен!');
        const userData = await db.users.findOne({ userID });
        const referrerData = await db.users.findOne({ userID: userData?.referrerID });
        await ctx.reply(`Ваш ID: <code>${ctx.from.id}</code>
<b>Ваш ник:</b> @${userData.username}

<b>Вас пригласил:</b>  @${referrerData.username}
<b>Лично приглашённых:</b> 0
<b>Ваши столы:</b>

🥉Бронзовый стол ещё не выбран

<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>`, {
            reply_markup: keyboards.links,
            parse_mode: 'HTML'
        });
        await setUserStep(ctx.from.id, 'subscribe-locker');
        await ctx.reply('<b>Главное меню</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: keyboards.mainMenu.build()
            },
            parse_mode: 'HTML'
        });
    }
    else {
        ctx.reply('❌Неверный реферальный код!');
    }
});
router.route('subscribe-locker', async (ctx) => {
    const userID = ctx.from.id;
    // checking
    const checks = [];
    checks.push(await ctx.api.getChatMember(CHANNEL_ID, userID), await ctx.api.getChatMember(CHAT_ID, userID));
    console.log(checks);
    console.log(checks.filter(i => i.status !== 'left'));
    if (checks.filter(i => i.status !== 'left').length === 2) {
        setUserStep(userID);
        return ctx.reply('Подписка подтверждена!');
    }
    ctx.reply('<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>', {
        reply_markup: keyboards.links,
        parse_mode: 'HTML'
    });
});
router.route('get-ref-username', async (ctx) => {
    const userID = ctx.from.id;
    const username = ctx.msg.text.replace('@', '');
    const specialReferralUserData = await db.users.findOne({ username });
    if (specialReferralUserData) {
        ctx.reply(`<b>🪄Реферальная ссылка сгенерирована ${BOT_URL}?start=r${specialReferralUserData.userID}s${userID}</b>`, {
            parse_mode: 'HTML'
        });
        setUserStep(userID);
    }
    else {
        setUserStep(userID);
        ctx.reply('<b>❌Пользователь не найден</b>', { parse_mode: 'HTML' });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUN6QyxPQUFPLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUMvRCxPQUFPLEtBQUssU0FBUyxNQUFNLGlCQUFpQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRzlELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBUSxFQUFFLEVBQUU7SUFDaEQsT0FBTyxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBRUYsS0FBSyxVQUFVLFVBQVUsQ0FBRSxNQUFjO0lBQ3JDLE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDdEQsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFRLEVBQUUsRUFBRTtJQUM1QyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtJQUNsQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3pCLElBQUksTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDaEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFN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