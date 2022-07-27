import db, { setUserValue } from '../../db-manager.js';
import * as keyboards from '../../keyboards.js';
export default async (ctx, next) => {
    const userID = ctx?.from?.id;
    const text = ctx.msg.text;
    const userData = await db.users.findOne({ userID });
    if (!userData?.username) {
        await db.users.updateOne({ userID }, {
            $set: {
                userID,
                username: ctx.from.username,
                from: ctx.from
            }
        }, { upsert: true });
    }
    console.log('startsjklkdfj');
    try {
        const payloadData = text.split(' ')[1];
        console.log(payloadData);
        const sIndex = payloadData.indexOf('s');
        console.log(sIndex);
        let referralID;
        if (sIndex > 0) {
            referralID = parseInt(payloadData?.slice(1, sIndex));
        }
        else
            referralID = parseInt(payloadData?.slice(1));
        console.log(referralID);
        if (payloadData.includes('s')) {
            const superReferrerID = parseInt(payloadData.slice(sIndex + 1));
            console.log(superReferrerID, 'jkdfhkjfdskljf');
            await setUserValue(userID, 'superReferrerID', superReferrerID);
        }
        if (payloadData[0] === 'r') {
            await setUserValue(userID, 'referrerID', referralID);
            db.users.findOne({ userID: referralID }).then((r) => {
                db.users.updateOne({ userID }, {
                    $set: {
                        fraction: r.fraction
                    }
                }, {
                    upsert: true
                });
            });
            await ctx.reply('Реферальный код успешно задан!', { reply_markup: { remove_keyboard: true } });
        }
    }
    catch (e) {
        // console.error(e)
    }
    if (!userData?.accepted || !userData?.referrerID) {
        ctx.reply('<a href="telegra.ph/Polzovatelskoe-soglashenie-Galaxy-i-politika-konfidencialnosti-06-19">' +
            'Пользовательское соглашение Galaxy и политика конфиденциальности' +
            '</a>\n', {
            reply_markup: keyboards.accept,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    }
    else {
        ctx.reply('<b>Добро пожаловать в меню</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: keyboards.mainMenu.build()
            },
            parse_mode: 'HTML'
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaGFuZGxlcnMvY29tbWFuZHMvc3RhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUN0RCxPQUFPLEtBQUssU0FBUyxNQUFNLG9CQUFvQixDQUFBO0FBRS9DLGVBQWUsS0FBSyxFQUFFLEdBQVEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDbEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUE7SUFDcEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUE7SUFDekIsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDbkQsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7UUFDckIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FDcEIsRUFBRSxNQUFNLEVBQUUsRUFDVjtZQUNJLElBQUksRUFBRTtnQkFDRixNQUFNO2dCQUNOLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQzNCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTthQUNqQjtTQUNKLEVBQ0QsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQ25CLENBQUE7S0FDSjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDNUIsSUFBSTtRQUNBLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4QixNQUFNLE1BQU0sR0FBVyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkIsSUFBSSxVQUFrQixDQUFBO1FBQ3RCLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNaLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTtTQUN2RDs7WUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3ZCLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMzQixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO1lBQzlDLE1BQU0sWUFBWSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQTtTQUNqRTtRQUNELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUN4QixNQUFNLFlBQVksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBQ3BELEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQ3JELEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzNCLElBQUksRUFBRTt3QkFDRixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7cUJBQ3ZCO2lCQUNKLEVBQUU7b0JBQ0MsTUFBTSxFQUFFLElBQUk7aUJBQ2YsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ2pHO0tBQ0o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLG1CQUFtQjtLQUN0QjtJQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRTtRQUM5QyxHQUFHLENBQUMsS0FBSyxDQUFDLDRGQUE0RjtZQUNsRyxrRUFBa0U7WUFDbEUsUUFBUSxFQUFFO1lBQ1YsWUFBWSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1lBQzlCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLHdCQUF3QixFQUFFLElBQUk7U0FDakMsQ0FBQyxDQUFBO0tBQ0w7U0FBTTtRQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUU7WUFDeEMsWUFBWSxFQUFFO2dCQUNWLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7YUFDdkM7WUFDRCxVQUFVLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUE7S0FDTDtBQUNMLENBQUMsQ0FBQSJ9