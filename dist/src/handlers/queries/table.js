import { giftBuilder } from '../../keyboards.js';
import { bronzeUpgrade, getBronzeDonwers, parseTableIdFromCbQuery } from '../../logic.js';
import db from '../../db-manager.js';
import { TABLES } from '../../../config.js';
export default async (ctx) => {
    // OR render
    const data = ctx.callbackQuery.data;
    const userID = ctx?.from?.id;
    const userData = await db.users.findOne({ userID });
    const tableID = parseTableIdFromCbQuery(data);
    console.log('e8742389247398');
    // ST TOFIX
    const techTitle = (await db.tables.findOne({ id: tableID })).techTitle;
    console.log('stage1');
    if (techTitle === 'bronze')
        await bronzeUpgrade(userID, userData);
    console.log('stage2');
    const table = await db.tables.findOne({ id: tableID });
    console.log(table);
    // ST END
    const masterData = await db.users.findOne({ userID: table.master });
    const referrerData = await db.users.findOne({ userID: table.referrer });
    const superReferrerData = await db.users.findOne({ userID: table?.super });
    console.log();
    if (table?.techTitle === 'bronze') {
        const { layerOne, layerTwo } = await getBronzeDonwers(tableID);
        console.log('stage3');
        if (table.status === 'created') {
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: 0 из 3
Всего дарителей на столе: 0 из 9
Выберите о ком получить информацию 👇️
`,
                reply_markup: giftBuilder(
                // @ts-ignore
                [{
                        name: masterData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].masterGift
                    }, {
                        name: superReferrerData?.username || referrerData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].referrerGift
                    }], tableID, layerOne, layerTwo),
                parse_mode: 'HTML'
            });
        }
        if (table.status === 'gifted') {
            const usersToInviteLeft = 3 - (userData?.referrals?.length | 0);
            // ctx.editMessageMedia({
            //     type: 'photo',
            //     media: { source: file }
            // })
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: ${layerOne?.length || 0} из 3
Всего дарителей на столе: ${layerTwo?.length || 0} из 9
Выберите о ком получить информацию 👇️
Пригласите еще ${usersToInviteLeft}/3 участников для разблокировки серебряного стола
        `,
                reply_markup: giftBuilder(null, tableID, layerOne, layerTwo),
                parse_mode: 'HTML'
            });
        }
        if (table.status === 'done') {
            ctx.editMessageCaption({
                caption: `
<b>Добро пожаловать на 
${table.title} (${table.creationDate})
ID стола: </b>#${table.id}

Всего рефералов на столе: ${layerOne?.length} из 3
Всего дарителей на столе: ${layerTwo?.length} из 9
Выберите о ком получить информацию 👇️
Стол выполнил свою задачу
        `,
                reply_markup: giftBuilder(null, tableID, layerOne, layerTwo),
                parse_mode: 'HTML'
            });
        }
    }
    else {
        // @ts-ignore
        const MASTER_GIFT = TABLES[techTitle].masterGift;
        // @ts-ignore
        const REFERRAL_GIFT = TABLES[techTitle].referrerGift;
        let optionalLine = '<b>Пригласитель: </b>❌';
        if (referrerData) {
            optionalLine = `<b>Пригласитель: </b> @${referrerData?.username} подарок - ${REFERRAL_GIFT}₽\n`;
        }
        if (table.status === 'created') {
            ctx.editMessageCaption({
                caption: `Добро пожаловать в ${table.title}
ID стола: #${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

` +
                    optionalLine,
                // @ts-ignore
                reply_markup: giftBuilder([{
                        name: masterData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].masterGift
                    }, {
                        name: referrerData?.username,
                        // @ts-ignore
                        amount: TABLES[techTitle].referrerGift
                    }], tableID),
                parse_mode: 'HTML'
            });
        }
        if (table.status === 'gifted' || table.status === 'done') {
            const tableDowners = (await db.users.findOne({ userID })).tables[table.techTitle].downers;
            console.log(tableDowners, 'sjhsdgfhjksgkfhgfdjkhgfjkh');
            ctx.editMessageCaption({
                caption: `${table.title}

ID стола: #${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)` +
                    `✅Подарки успешно подарены, пользователей снизу ${tableDowners?.length | 0}/3`,
                reply_markup: giftBuilder(null, tableID, tableDowners, []),
                parse_mode: 'HTML'
            });
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaGFuZGxlcnMvcXVlcmllcy90YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUF3QixNQUFNLG9CQUFvQixDQUFBO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQWdCLHVCQUF1QixFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDdkcsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDcEMsT0FBTyxFQUF1QixNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUloRSxlQUFlLEtBQUssRUFBRSxHQUFRLEVBQUUsRUFBRTtJQUM5QixZQUFZO0lBQ1osTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUE7SUFDbkMsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUE7SUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDbkQsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQzdCLFdBQVc7SUFDWCxNQUFNLFNBQVMsR0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtJQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3JCLElBQUksU0FBUyxLQUFLLFFBQVE7UUFBRSxNQUFNLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENB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