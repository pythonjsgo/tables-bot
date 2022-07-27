import db from '../db-manager.js'
import { ALFA_ID, TABLES } from '../../config.js'
import randomstring from 'randomstring'
import { getTodayDate } from '../logic.js'

// const ALPHA_ID = 1719482730
// const BETA_ID = 1560854919
const ALPHA_ID = 5555974699
const BETA_ID = 334147815
const DELTA_ID = 690853488
const GAMMA_ID = 5429977080
const OMEGA_ID = 5130300295
const downers = [BETA_ID, DELTA_ID, GAMMA_ID, OMEGA_ID]

for (const table in TABLES) {
    const randomTableID = randomstring.generate(5)
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
    }
    await db.users.updateOne(
        { userID: ALPHA_ID },
        {
            $set: {
                [`tables.${table}`]: tableData,
                tableLevel: 99,
                referralsAllowed: true,
                fraction: ALPHA_ID,
                referrerID: ALPHA_ID
            }
        },
        { upsert: true })
    await db.tables.insertOne({ ...tableData })

    for (const downerID of downers) {
        const randomTableID = randomstring.generate(5)
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
        }
        await db.users.updateOne({ userID: downerID },
            {
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
            },
            { upsert: true }
        )
        db.tables.insertOne({ ...tableData })
    }
}
console.log('Done')

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
