import { setUserStep } from '../../db-manager.js';
export default async (ctx) => {
    const userID = ctx.from.id;
    ctx.answerCallbackQuery();
    ctx.editMessageText('<b>Отправьте свой реферальный код:</b>', { parse_mode: 'HTML' });
    setUserStep(userID, 'get-ref-code');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50ZXItY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9oYW5kbGVycy9xdWVyaWVzL2VudGVyLWNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBRWpELGVBQWUsS0FBSyxFQUFFLEdBQVEsRUFBRSxFQUFFO0lBQzlCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBQzFCLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0lBQ3pCLEdBQUcsQ0FBQyxlQUFlLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUNyRixXQUFXLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZDLENBQUMsQ0FBQSJ9