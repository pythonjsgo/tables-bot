import db from '../db-manager.js';
import { TABLES } from '../../config.js';
import randomstring from 'randomstring';
import { getTodayDate } from '../logic.js';
// const ALPHA_ID = 1719482730
// const BETA_ID = 1560854919
const ALPHA_ID = 5555974699;
const BETA_ID = 334147815;
const DELTA_ID = 690853488;
const GAMMA_ID = 5429977080;
const OMEGA_ID = 5130300295;
const downers = [BETA_ID, DELTA_ID, GAMMA_ID, OMEGA_ID];
for (const table in TABLES) {
    const randomTableID = randomstring.generate(5);
    const tableData = {
        master: ALPHA_ID,
        owner: ALPHA_ID,
        referrer: ALPHA_ID,
        // @ts-ignore
        title: TABLES[table].title,
        status: 'gifted',
        relatives: { [ALPHA_ID]: 0 },
        id: randomTableID,
        downers,
        creationDate: getTodayDate(),
        joinDate: Date.now(),
        techTitle: table,
        alphaLevel: 0,
        upper: ALPHA_ID,
        fraction: ALPHA_ID
    };
    await db.users.updateOne({ userID: ALPHA_ID }, {
        $set: {
            [`tables.${table}`]: tableData,
            tableLevel: 99,
            referralsAllowed: true,
            fraction: ALPHA_ID,
            referrerID: ALPHA_ID
        }
    }, { upsert: true });
    await db.tables.insertOne({ ...tableData });
    for (const downerID of downers) {
        const randomTableID = randomstring.generate(5);
        const tableData = {
            master: ALPHA_ID,
            owner: downerID,
            referrer: ALPHA_ID,
            // @ts-ignore
            title: TABLES[table].title,
            status: 'gifted',
            relatives: { [ALPHA_ID]: 1, [downerID]: 0 },
            id: randomTableID,
            downers: [],
            referralsAllowed: true,
            creationDate: getTodayDate(),
            joinDate: Date.now(),
            techTitle: table,
            alphaLevel: 1,
            upper: ALPHA_ID
        };
        await db.users.updateOne({ userID: downerID }, {
            $set: {
                [`tables.${table}`]: {
                    master: ALPHA_ID,
                    owner: downerID,
                    referrer: ALPHA_ID,
                    // @ts-ignore
                    title: TABLES[table].title,
                    status: 'gifted',
                    relatives: { [ALPHA_ID]: 1, [downerID]: 0 },
                    id: randomTableID,
                    downers: [],
                    creationDate: getTodayDate(),
                    joinDate: Date.now(),
                    techTitle: table,
                    alphaLevel: 1,
                    upper: ALPHA_ID
                },
                tableLevel: 99,
                referralsAllowed: true,
                fraction: downerID,
                referrerID: ALPHA_ID
            }
        }, { upsert: true });
        db.tables.insertOne({ ...tableData });
    }
}
console.log('Done');
// db.users.updateOne({ userID: ALPHA_ID }, {
//     $set: {
//         tables: {
//             bronze: {
//                 status: 'done',
//                 downers: []
//             },
//             silver: {
//                 status: 'done',
//                 downers: []
//             },
//             gold: {
//                 status: 'done',
//                 downers: []
//             },
//             platinum: {
//                 status: 'done',
//                 downers: []
//             },
//             sapphire: {
//                 status: 'done',
//                 downers: []
//             },
//             ruby: {
//                 status: 'done',
//                 downers: []
//             },
//             emerald: {
//                 status: 'done',
//                 downers: []
//             },
//             diamond: {
//                 status: 'done',
//                 downers: []
//             }
//         }
//     }
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWFscGhhLWFjY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2NyaXB0cy9jcmVhdGUtYWxwaGEtYWNjb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUNqQyxPQUFPLEVBQVcsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDakQsT0FBTyxZQUFZLE1BQU0sY0FBYyxDQUFBO0FBQ3ZDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFMUMsOEJBQThCO0FBQzlCLDZCQUE2QjtBQUM3QixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUE7QUFDM0IsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFBO0FBQ3pCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQTtBQUMxQixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUE7QUFDM0IsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFBO0FBQzNCLE1BQU0sT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFFdkQsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7SUFDeEIsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QyxNQUFNLFNBQVMsR0FBRztRQUNkLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLEtBQUssRUFBRSxRQUFRO1FBQ2YsUUFBUSxFQUFFLFFBQVE7UUFDbEIsYUFBYTtRQUNiLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSztRQUMxQixNQUFNLEVBQUUsUUFBUTtRQUNoQixTQUFTLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUM1QixFQUFFLEVBQUUsYUFBYTtRQUNqQixPQUFPO1FBQ1AsWUFBWSxFQUFFLFlBQVksRUFB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