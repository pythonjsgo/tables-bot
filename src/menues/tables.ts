import { MenuMiddleware, MenuTemplate } from 'grammy-inline-menu'
import db from '../db-manager.js'
import { parseMenuQueryData } from '../logic.js'

const ROOT_TRIGGER: string = '/'

let tables = {}
const menu = new MenuTemplate<any>(
    async ctx => {
        const userID = ctx.from.id
        const userData = await db.users.findOne({ userID })
        tables = userData.tables
        const tablesCount = 0
        return {
            text: `<b>Мои столы</b> (${tablesCount})`,
            parse_mode: 'HTML'
        }
    }
)
const tableSubmenu = new MenuTemplate<any>(
    async ctx => {
        console.log('new submenu call', parseMenuQueryData(ctx.callbackQuery.data))

        return {
            text: 'Submenu',
            parse_mode: 'HTML'
        }
    }
)
// @ts-ignore
menu.chooseIntoSubmenu('look-table', tables, tableSubmenu)

export const middleware = new MenuMiddleware(ROOT_TRIGGER, menu)
export default middleware
