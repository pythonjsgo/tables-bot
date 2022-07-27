import db from '../../db-manager.js';
import { profileButton } from '../../keyboards.js';
import { getBronzeDonwers } from '../../logic.js';
export default async (ctx, next) => {
    const userID = ctx?.from?.id;
    const userData = await db.users.findOne({ userID });
    //  `<b>Реферальная ссылка:</b> ${BOT_URL}?start=r${userID}
    const referrerUsername = (await db.users.findOne({ userID: userData?.referrerID }))?.username;
    let replyText = `<b>Ваш ID:</b> <code>${userID}</code> 
<b>Ваш ник:</b> @${userData.username}

<b>Вас пригласил:</b> @${referrerUsername}
<b>Лично приглашённых:</b> ${userData?.referrals?.length | 0}
<b>Ваши столы:</b>\n`;
    let index = 0;
    if (userData?.tables) {
        for (const table of Object.values(userData.tables)) {
            // @ts-ignore-start
            replyText += `\n\n<b>${table.title}</b>\n`;
            // @ts-ignore
            replyText += `🟢Всего партнеров на столе: ${table?.downers?.length | 0}`;
            if (index === 0) {
                // @ts-ignore
                const { layerOne, layerTwo
                // @ts-ignore
                 } = await getBronzeDonwers(table.id);
                replyText += `\n🔵Всего дарителей на столе: ${layerTwo?.length | 0}`;
            }
            // @ts-ignore
            index++;
            // @ts-ignore-end
        }
    }
    else {
        replyText += '\n<b>Столы не открыты</b>';
    }
    ctx.reply(replyText, {
        reply_markup: profileButton,
        parse_mode: 'HTML'
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9oYW5kbGVycy9oZWFycy9wcm9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3BDLE9BQU8sRUFBaUIsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDakUsT0FBTyxFQUFnQixnQkFBZ0IsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRS9ELGVBQWUsS0FBSyxFQUFFLEdBQVEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDbEQsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUE7SUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDbkQsMkRBQTJEO0lBQzNELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFBO0lBQzdGLElBQUksU0FBUyxHQUFHLHdCQUF3QixNQUFNO21CQUMvQixRQUFRLENBQUMsUUFBUTs7eUJBRVgsZ0JBQWdCOzZCQUNaLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxHQUFHLENBQUM7cUJBQ3ZDLENBQUE7SUFFakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0lBQ2IsSUFBSSxRQUFRLEVBQUUsTUFBTSxFQUFFO1FBQ2xCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEQsbUJBQW1CO1lBQ25CLFNBQVMsSUFBSSxVQUFVLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQTtZQUUxQyxhQUFhO1lBQ2IsU0FBUyxJQUFJLCtCQUErQixLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQTtZQUN4RSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2IsYUFBYTtnQkFDYixNQUFNLEVBQ0YsUUFBUSxFQUNSLFFBQVE7Z0JBQ1IsYUFBYTtrQkFDaEIsR0FBRyxNQUFNLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDcEMsU0FBUyxJQUFJLGlDQUFpQyxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFBO2FBQ3ZFO1lBQ0QsYUFBYTtZQUNiLEtBQUssRUFBRSxDQUFBO1lBQ1AsaUJBQWlCO1NBQ3BCO0tBQ0o7U0FBTTtRQUNILFNBQVMsSUFBSSwyQkFBMkIsQ0FBQTtLQUMzQztJQUVELEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ2pCLFlBQVksRUFBRSxhQUFhO1FBQzNCLFVBQVUsRUFBRSxNQUFNO0tBQ3JCLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQSJ9