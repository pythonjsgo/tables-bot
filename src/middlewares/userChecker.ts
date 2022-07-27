import { NextFunction } from 'grammy'

export default async (ctx: any, next: NextFunction) => {
    if (!ctx.from?.username) {
        ctx.reply('<b>❗Для начала работы с ботом, необходимо имя пользователя.</b>\n\n' +
            'Установите имя пользователя в настройках Telegram и повторите попытку!', { parse_mode: 'HTML' })
    } else next()
}
