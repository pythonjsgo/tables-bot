import { getUserData } from '../../db-manager.js'
import * as keyboards from '../../keyboards.js'

export default async (ctx: any) => {
    ctx.answerCallbackQuery({ text: '❌Стол закрыт' })
}
