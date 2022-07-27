import { tables } from '../../keyboards.js';
import { TABLE_PHOTO_FILE_ID } from '../../../config.js';
export default async (ctx, next) => {
    // tablesMenu.replyToContext(ctx)
    ctx.replyWithPhoto(TABLE_PHOTO_FILE_ID, {
        caption: '<b>Мои столы</b>',
        parse_mode: 'HTML',
        reply_markup: tables
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2hhbmRsZXJzL2hlYXJzL3RhYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFHeEQsZUFBZSxLQUFLLEVBQUUsR0FBUSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNsRCxpQ0FBaUM7SUFDakMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRTtRQUNwQyxPQUFPLEVBQUUsa0JBQWtCO1FBQzNCLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLFlBQVksRUFBRSxNQUFNO0tBQ3ZCLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQSJ9