import db from '../../db-manager.js';
import { giftBuilder } from '../../keyboards.js';
import * as randomstring from 'randomstring';
import { g3PlusMasterSearcher, getTodayDate, tableUpperSearcher } from '../../logic.js';
import { TABLES } from '../../../config.js';
export const middleware = async (ctx) => {
    const userID = ctx.from.id;
    const tableTitle = ctx.callbackQuery.data.split('|')[1].trim();
    // tableTitle = tableTitle.slice(0, tableTitle.indexOf('/') + 1)
    console.log('tableTitle', tableTitle);
    const userData = await db.users.findOne({ userID });
    if (userData?.tables?.[tableTitle]) {
        await ctx.answerCallbackQuery(
        // @ts-ignore
        { text: `У вас уже открыт ${TABLES[tableTitle].title} стол!` });
        return null;
    }
    // checking and if is good, do this
    if (tableTitle === 'bronze') {
        const MASTER_GIFT = 5000;
        const REFERRAL_GIFT = 1000;
        if (!userData?.referrerID)
            return ctx.reply('Зарегестрируйтесь по реферральной ссылке');
        const upper = await tableUpperSearcher(userData.referrerID);
        const referrerData = await db.users.findOne({ userID: userData.referrerID });
        // if (upper.tables[tableTitle].downers.length >= 2) {
        //     db.users.updateOne({ userID: upper.userID }, {
        //         $set: {
        //             ['tables.']
        //         }
        //     })
        // }
        db.users.updateOne({ userID: upper.userID }, {
            $addToSet: {
                [`tables.${tableTitle}.downers`]: userID
            }
        }, {
            upsert: true
        });
        // ctx.reply(referrerData)
        // ctx.reply(JSON.stringify(referrerData, null, 2))
        db.users.updateOne({ userID: referrerData?.userID }, { $addToSet: { referrals: userID } }, { upsert: true });
        const table = {};
        table.id = randomstring.generate(5);
        table.status = 'created';
        // @ts-ignore
        table.title = TABLES[tableTitle].title;
        table.owner = userID;
        table.master = upper.referrerID;
        table.referrer = userData.referrerID;
        table.gifts = [];
        table.techTitle = tableTitle;
        table.upper = upper.userID;
        table.creationDate = getTodayDate();
        table.joinDate = Date.now();
        table.super = parseInt(userData?.superReferrerID);
        const upperTableData = await db.tables.findOne({
            $and: [
                { owner: upper.userID },
                { techTitle: tableTitle }
            ]
        });
        // ctx.reply(JSON.stringify(upperTableData, null, 2))
        const masterID = upperTableData.upper;
        const masterData = await db.users.findOne({ userID: masterID });
        const upperRelativesData = upper.tables?.bronze?.relatives || {};
        for (const key of Object.keys(upperRelativesData)) {
            upperRelativesData[key] = upperRelativesData[key] + 1;
        }
        console.log(table.id, 'fdlkdfjfdlfdjlklfkd');
        const superReferrerData = await db.users.findOne({ userID: userData?.superReferrerID });
        ctx.editMessageCaption({
            caption: `Добро пожаловать на
🥉 Бронзовый стол (${getTodayDate()})
ID стола: ${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

<b>Мастер: </b> @${masterData?.username} подарок - ${MASTER_GIFT}
<b>Пригласитель: </b> @${superReferrerData?.username || referrerData?.username} подарок - ${REFERRAL_GIFT}₽
`,
            reply_markup: giftBuilder([{
                    name: masterData?.username,
                    amount: MASTER_GIFT
                }, {
                    name: superReferrerData?.username || referrerData?.username,
                    amount: REFERRAL_GIFT
                }], table.id, [], []),
            parse_mode: 'HTML'
        });
        ctx.api.sendMessage(upper.userID, `<b>На ваш ${table.title}</b> зашёл новый партнёр ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' });
        ctx.api.sendMessage(masterData.userID, `<b>На ваш ${table.title}</b> зашёл новый даритель ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' });
        console.log('masterData', masterData, 'referrerData', referrerData);
        table.gifts.push({
            amount: REFERRAL_GIFT,
            from: userID,
            to: superReferrerData?.userID || referrerData?.userID
        }, {
            amount: MASTER_GIFT,
            from: userID,
            to: masterData.userID
        });
        db.tables.insertOne(table);
        db.users.updateOne({ userID }, {
            $set: {
                'tables.bronze': {
                    status: 'created',
                    relatives: Object.assign({ ...upperRelativesData }, { [userID]: 0 }),
                    id: table.id,
                    title: table.title
                }
            }
        });
        setTimeout(() => {
            // if not done us  erban
        }, 1000 * 60 * 60 * 24); // 24h
    }
    else {
        // @ts-ignore
        const tableMeta = TABLES[tableTitle];
        const MASTER_GIFT = tableMeta.masterGift;
        const REFERRAL_GIFT = tableMeta.referrerGift;
        console.log('calcusmfdjkfhskljh');
        let referrerData = await db.users.findOne({ userID: userData.referrerID });
        const superReferrerData = await db.users.findOne({ userID: userData?.superReferrerID });
        let alphaPriority = 0;
        // shitcode
        if (!referrerData?.tables?.[tableTitle]) {
            alphaPriority = userData.fraction;
            ctx.api.sendMessage(userData?.referrerID, `
<b>⚠️Вы пропустили реферальный бонус ${REFERRAL_GIFT} от ${userData?.username}</b>

Чтобы не пропустить следующий реферальный бонус откройте ${tableMeta.title}`);
            referrerData = null;
        }
        if (superReferrerData) {
            referrerData = superReferrerData;
        }
        const masterID = (await g3PlusMasterSearcher(alphaPriority || userData.referrerID, tableTitle)).userID;
        const masterData = (await db.users.findOneAndUpdate({ userID: masterID }, {
            $addToSet: {
                [`tables.${tableTitle}.downers`]: userID
            }
        }, {
            returnDocument: 'after',
            upsert: true
        })).value;
        try {
            if (masterData?.tables[tableTitle]?.downers?.length >= 3) {
                db.users.updateOne({ userID: masterID }, {
                    $set: {
                        [`tables.${tableTitle}.status`]: 'done'
                    },
                    $inc: {
                        tableLevel: 1
                    }
                });
                db.tables.updateOne({ id: masterData.tables[tableTitle].id }, {
                    $set: {
                        status: 'done'
                    }
                });
            }
        }
        catch (e) {
            console.error(e);
        }
        const creationDate = getTodayDate();
        const table = {
            id: randomstring.generate(5),
            status: 'created',
            techTitle: tableTitle,
            // @ts-ignore
            title: TABLES[tableTitle].title,
            owner: userID,
            master: masterData?.userID,
            referrer: userData?.referrerID,
            gifts: [],
            creationDate,
            joinDate: Date.now()
        };
        table.super = parseInt(userData?.superReferrerID);
        ctx.api.sendMessage(masterData.userID, `<b>На ваш ${table.title}</b> зашёл новый партнёр ${ctx.from.first_name} @${ctx.from.username}`, { parse_mode: 'HTML' });
        let optionalLine = '<b>Пригласитель: </b>❌';
        if (referrerData) {
            optionalLine = `<b>Пригласитель: </b> @${referrerData?.username} подарок - ${REFERRAL_GIFT}₽`;
        }
        else {
            ctx;
        }
        ctx.editMessageCaption({
            caption: `
            Добро пожаловать на
${tableMeta.title} (${getTodayDate()})
ID стола: ${table.id}

🧑🏼Вы дарите денежный
🎁 подарок ${MASTER_GIFT}₽ «Мастеру» и ${REFERRAL_GIFT}₽ «Аплайнер»

✅После того как Вы выполнили условия, «Мастер» и «Аплайнер» подтвердит Вас в системе, тем самым активирует Вас как «Мастер» вашего стола

🧑‍💼Связаться с «Мастером» и «Аплайнер» можно через чат Телеграм, узнайте реквизиты и сделайте перевод любым удобным способом!

Нажмите на смайлик руки чтобы скопировать шаблон текста: (Привет 👋, Хочу подарить тебе  денежный подарок в размере 5.000₽🎁)

📢Оповестите «Мастера» и «Аплайнера» если у Вас блок в телеграм на отправку сообщений)

Мастер: @${masterData.username} подарок - ${MASTER_GIFT}
` + optionalLine,
            reply_markup: giftBuilder([{
                    name: masterData?.username,
                    amount: MASTER_GIFT
                }, {
                    name: referrerData?.username,
                    amount: REFERRAL_GIFT
                }], table.id, [], []),
            parse_mode: 'HTML'
        });
        table.gifts.push({
            amount: MASTER_GIFT,
            from: userID,
            to: masterData.userID
        });
        if (referrerData) {
            table.gifts.push({
                amount: REFERRAL_GIFT,
                from: userID,
                to: referrerData.userID
            });
        }
        db.tables.insertOne(table);
        const upperRelativesData = masterData.tables?.bronze?.relatives || {};
        for (const key of Object.keys(upperRelativesData)) {
            upperRelativesData[key] = upperRelativesData[key] + 1;
        }
        db.users.updateOne({ userID }, {
            $set: {
                [`tables.${tableTitle}`]: {
                    status: 'created',
                    id: table.id,
                    alphaLevel: (masterData?.tables?.[tableTitle]?.alphaLevel | 0) + 1,
                    relatives: Object.assign({ ...upperRelativesData }, { [userID]: 0 })
                }
            }
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Blbi10YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9oYW5kbGVycy9xdWVyaWVzL29wZW4tdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixNQUFNLHFCQUFxQixDQUFBO0FBQ3pELE9BQU8sRUFBRSxXQUFXLEVBQWlCLE1BQU0sb0JBQW9CLENBQUE7QUFDL0QsT0FBTyxLQUFLLFlBQVksTUFBTSxjQUFjLENBQUE7QUFDNUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBa0IsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN2RyxPQUFPLEVBQWlDLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTFFLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQUUsR0FBUSxFQUFFLEVBQUU7SUFDekMsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7SUFDbEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzlELGdFQUFnRTtJQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUNyQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUNuRCxJQUFJLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNoQyxNQUFNLEdBQUcsQ0FBQyxtQkFBbUI7UUFDekIsYUFBYTtRQUNiLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FDakUsQ0FBQTtRQUNELE9BQU8sSUFB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