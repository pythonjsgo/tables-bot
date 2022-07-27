export default async (ctx, next) => {
    if (!ctx.from?.username) {
        ctx.reply('<b>❗Для начала работы с ботом, необходимо имя пользователя.</b>\n\n' +
            'Установите имя пользователя в настройках Telegram и повторите попытку!', { parse_mode: 'HTML' });
    }
    else
        next();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlckNoZWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWlkZGxld2FyZXMvdXNlckNoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsZUFBZSxLQUFLLEVBQUUsR0FBUSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNsRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDckIsR0FBRyxDQUFDLEtBQUssQ0FBQyxxRUFBcUU7WUFDM0Usd0VBQXdFLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtLQUN4Rzs7UUFBTSxJQUFJLEVBQUUsQ0FBQTtBQUNqQixDQUFDLENBQUEifQ==