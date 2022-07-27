import { NextFunction } from 'grammy'
import { aboutProject } from '../../keyboards.js'

export default async (ctx: any, next: NextFunction) => {
    ctx.reply('О проекте', { reply_markup: aboutProject })
}
