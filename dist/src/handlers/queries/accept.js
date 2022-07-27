import db from '../../db-manager.js';
import * as keyboards from '../../keyboards.js';
export default async (ctx) => {
    const userID = ctx.from.id;
    db.users.updateOne({ userID }, { $set: { accepted: true } }, { upsert: true });
    ctx.editMessageText(`<b>💫Galaxy</b> - Проект созданный на экономике дарения.

Децентрализованная система взаимообмена финансовыми подарками через телеграмм бота!

Для надежности и простоты работы создан универсальный бот, в который интегрированы программные коды, за счет которых работа системы точна и безопасна. Нет компании, учреждения, брокера, трейдера или иной коммерческой структуры все, что Вам нужно, это компьютер/смартфон и Telegram.

Войти в систему можно только по приглашению. Вы присоединяетесь к Galaxy, дарите 5000₽ «Мастеру» и 1000₽ вашему «Аплайнеру» 

Это единственный раз, когда надо будет брать деньги из собственного кармана.`, {
        reply_markup: keyboards.start,
        parse_mode: 'HTML'
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2hhbmRsZXJzL3F1ZXJpZXMvYWNjZXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3BDLE9BQU8sS0FBSyxTQUFTLE1BQU0sb0JBQW9CLENBQUE7QUFFL0MsZUFBZSxLQUFLLEVBQUUsR0FBUSxFQUFFLEVBQUU7SUFDOUIsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7SUFDbEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDOUUsR0FBRyxDQUFDLGVBQWUsQ0FBQzs7Ozs7Ozs7NkVBUXFELEVBQUU7UUFDdkUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxLQUFLO1FBQzdCLFVBQVUsRUFBRSxNQUFNO0tBQ3JCLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQSJ9