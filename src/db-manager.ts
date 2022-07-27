import { MongoClient } from 'mongodb'
import * as config from '../config.js'

const client = new MongoClient(config.MONGO_URI)

await client.connect()
const _db: any = client.db(config.DB_NAME)
// UserLevel?
export const db = {
    users: _db.collection('users'),
    gifts: _db.collection('gifts'),
    tables: _db.collection('tables'),
    db: _db
}
export default db

export async function setUserStep (userID: number, step: string = '') {
    return db.users.updateOne({ userID }, { $set: { step } }, { upsert: true })
}
export async function getUserStep (userID: number) {
    return (await db.users.findOne({ userID }))?.step
}

export async function setUserValue (userID: number, value: string, data: any) {
    return db.users.updateOne({ userID }, { $set: { [value]: data } }, { upsert: true })
}

export async function getUserData (userID: number) {
    return await db?.users?.findOne({ userID })
}

export async function getUserValue (userID: number, value: string) {
    // @todo
    // return db.users.updateOne({userID}, )
}

export async function getUserReferrer (userID: number) {
    return (await db.users.findOne({ userID }))?.referrerID
}
