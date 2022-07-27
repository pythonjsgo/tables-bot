import db from './db-manager.js'
import { ALFA_ID, TABLES } from '../config.js'

export const techNameToFull = new Map()
    .set('bronze', '🥉️Бронзовый стол')
    .set('silver', '🥈Серебряный стол')
    .set('gold', '🥇️Золотой стол')

// console.log(getFullTableName('test'))

export function parseTableIDFromText (text: string): string {
    return text.slice(text.indexOf('#') + 1, text.indexOf('#') + 6)
}

export function parseTableIdFromCbQuery (data: string): string {
    data = data.slice(data.indexOf('table|') + 6)
    data = data.slice(0, data.indexOf('/'))
    return data
}

export async function tableUpperSearcher (referrerID: number) {
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
        }).sort({ 'tables.bronze.joinDate': 1 }).toArray()
        // console.log('upper found', upper)
        if (upper?.length) return upper[0]
    }
    console.log('ALFA_ID', ALFA_ID)
    return await db.users.findOne({ userID: ALFA_ID })
}

// Table Whois downer model
// Priority dynamic index
// doubled index Priority and posibillity
//
export async function g3PlusMasterSearcher (referrerID: number, tableTitle: string) {
    console.log(referrerID, tableTitle, '2sdnkfsdghj#')
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
        }).sort({ [`tables.${tableTitle}.joinDate`]: 1 }).toArray())[0]
        console.log('upper found', upper)
        if (upper) {
            // if (upper?.tables[tableTitle]?.downers?.length >= 2) {
            //     db.users.updateOne({ userID: upper.userID }, {
            //         $set: {
            //             [`tables.${tableTitle}.status`]: 'done'
            //         }
            //     })
            // }
            return upper
        }
    }
    console.log('ALFA_ID', ALFA_ID)
    return await db.users.findOne({ userID: ALFA_ID })
}

export async function bronzeUpgrade (userID: number, userData: any = null) {
    if (!userData) userData = await db.users.findOne({ userID })
    const bronzeTableData = await db.tables.findOne(
        { id: userData.tables.bronze.id }
    )
    console.log('390840928349082094')
    if (bronzeTableData.status === 'gifted') {
        console.log('92829837948789234789347')
        if (userData?.referrals?.length >= 3) {
            await db.tables.updateOne(
                { id: bronzeTableData.id },
                {
                    $set: {
                        status: 'done'
                    }
                }
            )
            return db.users.updateOne(
                { userID },
                {
                    $set: {
                        tableLevel: 1,
                        'tables.bronze.status': 'done'
                    }
                }
            )
        }
    }
}

export async function getBronzeDonwers (tableID: string) {
    const tableData = (await db.users.findOne(
        { 'tables.bronze.id': tableID }
    ))?.tables?.bronze
    const layerOne = tableData?.downers
    const layerTwo = []
    try {
        if (layerOne?.length > 0) {
            for (const userID of layerOne) {
                try {
                    const downers = (await db.users.findOne({ userID }))?.tables?.bronze?.downers
                    // @ts-ignore
                    layerTwo.push(...downers)
                } catch (e) {
                }
            }
        }
    } catch (e) {

    }

    return {
        layerOne,
        layerTwo
    }
}

export async function getBronzeDonwersForImage (tableID: string) {
    const tableData = (await db.users.findOne(
        { 'tables.bronze.id': tableID }
    ))?.tables?.bronze
    const layerOne = tableData?.downers
    console.log('gdgdogdkfhjgjkdgh', layerOne)
    // Layer one possibly max length is 3
    const layerTwo = [
        [],
        [],
        []
    ]
    try {
        if (layerOne?.length > 0) {
            let index = 0
            for (const userID of layerOne) {
                try {
                    const downers = (await db.users.findOne({ userID }))?.tables?.bronze?.downers
                    // @ts-ignore
                    layerTwo[index++] = downers
                } catch (e) {
                }
            }
        }
    } catch (e) {

    }

    return {
        layerOne,
        layerTwo
    }
}

export async function get3GDowners (tableID: string, techTitle: string = 'bronze') {
    const tableData = await db.users.findOne(
        { [`tables.${techTitle}.id`]: tableID }
    )
    return tableData
}

console.log(await get3GDowners('HQXbj', 'bronze'))

export function parseMenuQueryData (data: string): string {
    data = data.split(':')[1]
    data = data.slice(0, data.indexOf('/'))
    return data
}

export function getTodayDate () {
    const creationDate = new Date()
    return `${creationDate.getDate()}.${creationDate.getMonth() + 1}.${creationDate.getFullYear()}`
}

export async function getUsernames (userIds: any) {
    try {
        return (await db.users.find({ userID: { $in: userIds } }).toArray()).map((i: any) => i.username)
    } catch (e) {
        return []
    }
}
