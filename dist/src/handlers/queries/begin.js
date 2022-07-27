import db, { setUserStep } from '../../db-manager.js';
import * as keyboards from '../../keyboards.js';
export default async (ctx) => {
    const userData = await db.users.findOne({ userID: ctx.from.id });
    if (!userData?.referrerID) {
        return ctx.editMessageText('Введите свой реферальный код  пригласившего или перейдите по ссылке', { reply_markup: keyboards.enterCode });
    }
    const referrerData = await db.users.findOne({ userID: userData?.referrerID });
    await ctx.editMessageText(`Ваш ID: <code>${ctx.from.id}</code>
<b>Ваш ник:</b> @${userData.username}

<b>Вас пригласил:</b>  @${referrerData?.username}
<b>Лично приглашённых:</b> 0
<b>Ваши столы:</b>

🥉Бронзовый стол ещё не выбран

<b>Для дальнейшей работы бота, Вам необходимо подписаться на наш Чат и Канал👇</b>`, { reply_markup: keyboards.links, parse_mode: 'HTML' });
    await setUserStep(ctx.from.id, 'subscribe-locker');
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
        });
    }, 2000);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaGFuZGxlcnMvcXVlcmllcy9iZWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3JELE9BQU8sS0FBSyxTQUFTLE1BQU0sb0JBQW9CLENBQUE7QUFHL0MsZUFBZSxLQUFLLEVBQUUsR0FBUSxFQUFFLEVBQUU7SUFDOUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDaEUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUU7UUFDdkIsT0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDLHFFQUFxRSxFQUFFLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0tBQzNJO0lBQ0QsTUFBTSxZQUFZLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUM3RSxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTttQkFDdkMsUUFBUSxDQUFDLFFBQVE7OzBCQUVWLFlBQVksRUFBRSxRQUFROzs7Ozs7bUZBTW1DLEVBQUUsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQ3JJLENBQUE7SUFDRCxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0lBQ2xELDJFQUEyRTtJQUMzRSwyQ0FBMkM7SUFDM0MsMENBQTBDO0lBQzFDLG9EQUFvRDtJQUNwRCxpREFBaUQ7SUFDakQsNERBQTREO0lBQzVELFNBQVM7SUFFVCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTtZQUM3QixZQUFZLEVBQUU7Z0JBQ1YsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTthQUN2QztZQUNELFVBQVUsRUFBRSxNQUFNO1NBQ3JCLENBQUMsQ0FBQTtJQUNOLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNaLENBQUMsQ0FBQSJ9