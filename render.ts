import Jimp from 'jimp'
import { getUsernames } from './src/logic.js'

// onwer, layerOne, layerTwo

const images = {
    silver: './src/assets/SILVER.png',
    gold: './src/assets/GOLD.png',
    platinum: './src/assets/PLATINUM.png',
    sapphire: './src/assets/SAPFIR.png',
    ruby: './src/assets/RUBY.png',
    emerald: './src/assets/EMERALD.png',
    diamond: './src/assets/DIAMOND.png',
    start: './src/assets/START.png'
}

export async function renderBronzeTable (masterUsername: any, layerOne: any, layerTwo: any) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
    // master ( self )
    const image = await Jimp.read('./src/assets/BRONZE.png')
    image.print(font, 995, 363, `@${masterUsername}`)
    layerOne = await getUsernames(layerOne)
    for (let x = 0; x < layerTwo.length; x++) {
        layerTwo[x] = await getUsernames(layerTwo[x])
    }
    // gifter 1
    if (layerTwo[0]?.[0]) image.print(font, 43, 420, '@' + layerTwo[0][0])
    // gifter 2
    if (layerTwo[0]?.[1]) image.print(font, 43, 690, '@' + layerTwo[0]?.[1])
    // gifter 3
    if (layerTwo[0]?.[2]) image.print(font, 43, 940, '@' + layerTwo[0]?.[2])
    // gifter 4
    if (layerTwo[1]?.[0]) image.print(font, 650, 965, '@' + layerTwo[1]?.[0])
    // gifter 5
    if (layerTwo[1]?.[1]) image.print(font, 945, 965, '@' + layerTwo[1]?.[1])
    // gifter 6
    if (layerTwo[1]?.[2]) image.print(font, 1236, 965, '@' + layerTwo[1]?.[2])
    // gifter 7
    if (layerTwo[2]?.[0]) image.print(font, 1790, 420, '@' + layerTwo[2]?.[0])
    // gifter 8
    if (layerTwo[2]?.[1]) image.print(font, 1790, 685, '@' + layerTwo[2]?.[1])
    // gifter 9
    if (layerTwo[2]?.[2]) image.print(font, 1790, 955, '@' + layerTwo[2]?.[2])
    // image.print(font, 890, 970, '@gusername')
    // partner 1
    if (layerOne[0]) image.print(font, 450, 695, '@' + layerOne[0])
    // partner 2
    if (layerOne[1]) image.print(font, 945, 685, '@' + layerOne[1])
    // partner 3
    if (layerOne[2]) image.print(font, 1450, 695, '@' + layerOne[2])
    // Writing image after processing
    // image.writeAsync('./src/assets/tableOut.png')
    return await image.getBufferAsync('image/png')
    // await image.writeAsync('./src/assets/tableOut.png')
}

export async function renderG3Table (tableTitle = 'silver', masterUsername: string, gifters: any) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
    // @ts-ignore
    const image = await Jimp.read(images[tableTitle])
    // master ( self )
    image.print(font, 940, 370, '@' + masterUsername)
    console.log(gifters)
    // gifter 1
    if (gifters[0]) image.print(font, 410, 740, '@' + gifters[0])
    // gifter 2
    if (gifters[1]) image.print(font, 940, 815, '@' + gifters[1])
    // gifter 3
    if (gifters[2]) image.print(font, 1500, 740, '@' + gifters[2])
    // gifter 3
    // Writing image after processing
    // await image.writeAsync('./src/assets/tableOut.png')
    return await image.getBufferAsync('image/png')
}

renderG3Table('silver', 'shit', ['fuck', 'gdgfd', 'dkhjdfg'])
