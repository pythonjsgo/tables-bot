import db from './db-manager.js';
import { ALFA_ID } from '../config.js';
export const techNameToFull = new Map()
    .set('bronze', '🥉️Бронзовый стол')
    .set('silver', '🥈Серебряный стол')
    .set('gold', '🥇️Золотой стол');
// console.log(getFullTableName('test'))
export function parseTableIDFromText(text) {
    return text.slice(text.indexOf('#') + 1, text.indexOf('#') + 6);
}
export function parseTableIdFromCbQuery(data) {
    data = data.slice(data.indexOf('table|') + 6);
    data = data.slice(0, data.indexOf('/'));
    return data;
}
export async function tableUpperSearcher(referrerID) {
    for (let i = 0; i < 9; i++) {
        const upper = await db.users.find({
            $and: [
                {
                    [`tables.bronze.relatives.${referrerID}`]: i
                },
                {
                    'tables.bronze.downers.2': { $exists: false }
                }
            ]
        }).sort({ 'tables.bronze.joinDate': 1 }).toArray();
        // console.log('upper found', upper)
        if (upper?.length)
            return upper[0];
    }
    console.log('ALFA_ID', ALFA_ID);
    return await db.users.findOne({ userID: ALFA_ID });
}
// Table Whois downer model
// Priority dynamic index
// doubled index Priority and posibillity
//
export async function g3PlusMasterSearcher(referrerID, tableTitle) {
    console.log(referrerID, tableTitle, '2sdnkfsdghj#');
    for (let i = 0; i < 9; i++) {
        // const upper = await db.users.findOne({
        //     [`tables.${tableTitle}.alphaLevel`]: i,
        //     //  'tables.silver.canBeMaster': true,
        //     [`tables.${tableTitle}.status`]: 'gifted'
        // })
        const upper = (await db.users.find({
            $and: [
                {
                    [`tables.${tableTitle}.relatives.${referrerID}`]: i
                },
                {
                    [`tables.${tableTitle}.downers.2`]: { $exists: false }
                }
            ]
        }).sort({ [`tables.${tableTitle}.joinDate`]: 1 }).toArray())[0];
        console.log('upper found', upper);
        if (upper) {
            // if (upper?.tables[tableTitle]?.downers?.length >= 2) {
            //     db.users.updateOne({ userID: upper.userID }, {
            //         $set: {
            //             [`tables.${tableTitle}.status`]: 'done'
            //         }
            //     })
            // }
            return upper;
        }
    }
    console.log('ALFA_ID', ALFA_ID);
    return await db.users.findOne({ userID: ALFA_ID });
}
export async function bronzeUpgrade(userID, userData = null) {
    if (!userData)
        userData = await db.users.findOne({ userID });
    const bronzeTableData = await db.tables.findOne({ id: userData.tables.bronze.id });
    console.log('390840928349082094');
    if (bronzeTableData.status === 'gifted') {
        console.log('92829837948789234789347');
        if (userData?.referrals?.length >= 3) {
            await db.tables.updateOne({ id: bronzeTableData.id }, {
                $set: {
                    status: 'done'
                }
            });
            return db.users.updateOne({ userID }, {
                $set: {
                    tableLevel: 1,
                    'tables.bronze.status': 'done'
                }
            });
        }
    }
}
export async function getBronzeDonwers(tableID) {
    const tableData = (await db.users.findOne({ 'tables.bronze.id': tableID }))?.tables?.bronze;
    const layerOne = tableData?.downers;
    const layerTwo = [];
    try {
        if (layerOne?.length > 0) {
            for (const userID of layerOne) {
                try {
                    const downers = (await db.users.findOne({ userID }))?.tables?.bronze?.downers;
                    // @ts-ignore
                    layerTwo.push(...downers);
                }
                catch (e) {
                }
            }
        }
    }
    catch (e) {
    }
    return {
        layerOne,
        layerTwo
    };
}
export async function getBronzeDonwersForImage(tableID) {
    const tableData = (await db.users.findOne({ 'tables.bronze.id': tableID }))?.tables?.bronze;
    const layerOne = tableData?.downers;
    console.log('gdgdogdkfhjgjkdgh', layerOne);
    // Layer one possibly max length is 3
    const layerTwo = [
        [],
        [],
        []
    ];
    try {
        if (layerOne?.length > 0) {
            let index = 0;
            for (const userID of layerOne) {
                try {
                    const downers = (await db.users.findOne({ userID }))?.tables?.bronze?.downers;
                    // @ts-ignore
                    layerTwo[index++] = downers;
                }
                catch (e) {
                }
            }
        }
    }
    catch (e) {
    }
    return {
        layerOne,
        layerTwo
    };
}
export async function get3GDowners(tableID, techTitle = 'bronze') {
    const tableData = await db.users.findOne({ [`tables.${techTitle}.id`]: tableID });
    return tableData;
}
console.log(await get3GDowners('HQXbj', 'bronze'));
export function parseMenuQueryData(data) {
    data = data.split(':')[1];
    data = data.slice(0, data.indexOf('/'));
    return data;
}
export function getTodayDate() {
    const creationDate = new Date();
    return `${creationDate.getDate()}.${creationDate.getMonth()}.${creationDate.getFullYear()}`;
}
export async function getUsernames(userIds) {
    try {
        return (await db.users.find({ userID: { $in: userIds } }).toArray()).map((i) => i.username);
    }
    catch (e) {
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbG9naWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBVSxNQUFNLGNBQWMsQ0FBQTtBQUU5QyxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUU7S0FDbEMsR0FBRyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztLQUNsQyxHQUFHLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO0tBQ2xDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtBQUVuQyx3Q0FBd0M7QUFFeEMsTUFBTSxVQUFVLG9CQUFvQixDQUFFLElBQVk7SUFDOUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDbkUsQ0FBQztBQUVELE1BQU0sVUFBVSx1QkFBdUIsQ0FBRSxJQUFZO0lBQ2pELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDN0MsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUN2QyxPQUFPLElBQUksQ0FBQTtBQUNmLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGtCQUFrQixDQUFFLFVBQWtCO0lBQ3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxF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