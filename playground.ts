import { Bot, InputFile } from 'grammy'

import { run } from '@grammyjs/runner'
import { TOKEN } from './config.js'
import { renderBronzeTable } from './render.js'
import db from './src/db-manager.js'

export const bot = new Bot<any>(TOKEN)

// bot.command('start', async ctx => {
//     ctx.reply(ctx.chat.id)
//     // const buffer = await renderBronzeTable()
//     // const msg = await ctx.replyWithPhoto(new InputFile(buffer))
//     // await new Promise(resolve => setTimeout(resolve, 2000))
//     // const bufferTwo = await renderBronzeTable()
//     // ctx.api.editMessageMedia(ctx?.from?.id, msg.message_id, {
//     //     type: 'photo',
//     //     media: new InputFile(bufferTwo)
//     // })
//     // console.log(msg)
// })
// run(bot)

console.log(
    await db.users.updateOne({
        'tables.bronze.id': 'eVxCm'
    }, {
        $pull: {
            'tables.bronze.downers': 5378738221
        }
    }),
    JSON.stringify(await db.users.findOne({
        'tables.bronze.id': 'eVxCm'
    }), null, 2)
)
