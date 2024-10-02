export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import {Bot, InputFile, webhookCallback} from 'grammy'

const token = process.env.BOT_TOKEN

const groupId = process.env.GROUP_ID

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')
if(!groupId) throw new Error('GROUP_ID environment variable not found')

const bot = new Bot(token)
// bot.on('message:text', async (ctx) => {
//   await ctx.reply(ctx.message.text)
// })

// bot.on('my_chat_member', (ctx) => {
//   const groupId = ctx.chat.id;
//   console.log(`Bot added to group. Group ID: ${groupId}`);
// });

interface UserInfoType {
    name: string;
    phone_number: string;
    company: string;
    number_pc: string;
}

interface UserProblemType {
    device: string;
    message: string | File;
    photo: File[];
    video: File[];
}

// bot.on('my_chat_member', (ctx) => {
//     const groupId = ctx.chat.id;
//     console.log(`Bot added to group. Group ID: ${groupId}`);
// });
// bot.start()


export const POST = async function (request: Request) {
    const formData = await request.formData()

    const userInfo: UserInfoType = {
        name: formData.get("name")! as string,
        phone_number: formData.get("phone_number")! as string,
        company: formData.get("company")! as string,
        number_pc: formData.get("number_pc")! as string
    }
    const userProblemInfo: UserProblemType = {
        device: formData.get("device")! as string,
        message: (formData.get("message_file") || formData.get("message_text"))!,
        photo: formData.getAll("photo") as File[],
        video: formData.getAll("video") as File[]
    }

    userInfo.phone_number = `\\${userInfo.phone_number.split(" - ").join("\\-")}`

    bot.api.sendMessage(groupId, `*Имя:* ${userInfo.name} \n*Номер телефона:* ${userInfo.phone_number}`, {parse_mode: "MarkdownV2"}).then()

    userProblemInfo.photo.forEach((file) => {
        file.arrayBuffer().then((buff) => {
            let newForm = new Uint8Array(buff)
            bot.api.sendPhoto(groupId, new InputFile(newForm))
        })
    })


    webhookCallback(bot, 'std/http')

    return Response.json({})
}