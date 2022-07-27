import { NextFunction } from 'grammy'
import { getUserData } from '../../db-manager.js'

export default async (ctx: any, next: NextFunction) => {
    const userID: number = ctx.from.id
}
