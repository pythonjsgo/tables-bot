import { bot } from '@'

function newPartnerOnTable (destUserID: number, tableTitle: string, newUserData: {name: string, username: string }) {
    bot.api.sendMessage(
        destUserID,
        `<b>На ваш ${tableTitle}</b> зашел новый партнер ${newUserData.name} ${newUserData.username}`
    )
}
