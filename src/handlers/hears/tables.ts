import { NextFunction } from 'grammy'
import { tables } from '../../keyboards.js'
import { TABLE_PHOTO_FILE_ID } from '../../../config.js'
import tablesMenu from '../../menues/tables.js'

export default async (ctx: any, next: NextFunction) => {
    // tablesMenu.replyToContext(ctx)
    ctx.replyWithPhoto(TABLE_PHOTO_FILE_ID, {
        caption: '<b>Мои столы</b>',
        parse_mode: 'HTML',
        reply_markup: tables
    })
}
