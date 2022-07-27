import { setUserStep } from '../../db-manager.js'

export default async (ctx: any) => {
    const userID = ctx.from.id
    ctx.answerCallbackQuery()
    ctx.editMessageText('<b>Отправьте свой реферальный код:</b>', { parse_mode: 'HTML' })
    setUserStep(userID, 'get-ref-code')
}
