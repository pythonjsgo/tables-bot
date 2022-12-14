import { MongoClient } from 'mongodb';
import * as config from '../config.js';
const client = new MongoClient(config.MONGO_URI);
await client.connect();
const _db = client.db(config.DB_NAME);
// UserLevel?
export const db = {
    users: _db.collection('users'),
    gifts: _db.collection('gifts'),
    tables: _db.collection('tables'),
    db: _db
};
export default db;
export async function setUserStep(userID, step = '') {
    return db.users.updateOne({ userID }, { $set: { step } }, { upsert: true });
}
export async function getUserStep(userID) {
    return (await db.users.findOne({ userID }))?.step;
}
export async function setUserValue(userID, value, data) {
    return db.users.updateOne({ userID }, { $set: { [value]: data } }, { upsert: true });
}
export async function getUserData(userID) {
    return await db?.users?.findOne({ userID });
}
export async function getUserValue(userID, value) {
    // @todo
    // return db.users.updateOne({userID}, )
}
export async function getUserReferrer(userID) {
    return (await db.users.findOne({ userID }))?.referrerID;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGItbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDckMsT0FBTyxLQUFLLE1BQU0sTUFBTSxjQUFjLENBQUE7QUFFdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRWhELE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFDLGFBQWE7QUFDYixNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUc7SUFDZCxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDOUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQzlCLE1BQU0sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUNoQyxFQUFFLEVBQUUsR0FBRztDQUNWLENBQUE7QUFDRCxlQUFlLEVBQUUsQ0FBQTtBQUVqQixNQUFNLENBQUMsS0FBSyxVQUFVLFdBQVcsQ0FBRSxNQUFjLEVBQUUsT0FBZSxFQUFFO0lBQ2hFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUMvRSxDQUFDO0FBQ0QsTUFBTSxDQUFDLEtBQUssVUFBVSxXQUFXLENBQUUsTUFBYztJQUM3QyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUE7QUFDckQsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsWUFBWSxDQUFFLE1BQWMsRUFBRSxLQUFhLEVBQUUsSUFBUztJQUN4RSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN4RixDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxXQUFXLENBQUUsTUFBYztJQUM3QyxPQUFPLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQy9DLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FBRSxNQUFjLEVBQUUsS0FBYTtJQUM3RCxRQUFRO0lBQ1Isd0NBQXdDO0FBQzVDLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGVBQWUsQ0FBRSxNQUFjO0lBQ2pELE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQTtBQUMzRCxDQUFDIn0=