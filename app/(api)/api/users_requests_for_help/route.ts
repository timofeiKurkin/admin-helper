import {InputMediaPhoto, InputMediaVideo} from "grammy/types";
import {Bot, InputFile, webhookCallback} from 'grammy'
import {PermissionsOfFormStatesType} from "@/app/(auxiliary)/types/AppTypes/Context";

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

// import {Other} from "grammy/out/core/api";
// import {Other} from "grammy/out/core/api";

const token = process.env.BOT_TOKEN

const groupId = process.env.GROUP_ID

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')
if (!groupId) throw new Error('GROUP_ID environment variable not found')

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
    message_file: File | null;
    message_text: string | null;
    photo: File[];
    video: File[];
}

// bot.on('my_chat_member', (ctx) => {
//     const groupId = ctx.chat.id;
//     console.log(`Bot added to group. Group ID: ${groupId}`);
// });
// bot.start()

const recognizeVoiceRecorder = async (voiceRecorder: File) => {
    try {
        const response = await fetch(
            `${process.env.HF_API_URL}openai/whisper-large-v3`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: voiceRecorder
            }
        )

        if (response.status === 200) {
            const message = await response.json()
            return message.text
        } else {
            return "Не удалось распознать текст на голосовом сообщении"
        }
    } catch (e) {
        throw new Error(`There's an error:`, {cause: e})
    }
}

const escapingCharacters = (data: string) => {
    const specialChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
    return data.split("").map((symbol) => specialChars.includes(symbol) ? `\\${symbol}` : symbol).join("")
}


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
        message_file: formData.get("message_file") as File | null,
        message_text: formData.get("message_text") as string | null,
        photo: formData.getAll("photo") as File[],
        video: formData.getAll("video") as File[]
    }

    const formPermissions: PermissionsOfFormStatesType = {
        userCanTalk: Boolean(formData.get("userCanTalk")! as string),
        userAgreed: Boolean(formData.get("userAgreed")! as string)
    }

    const userMessage: string = userProblemInfo.message_file ? await recognizeVoiceRecorder(userProblemInfo.message_file) : userProblemInfo.message_text

    const botMessage = `
Новая заявка о технической помощи

Информация о пользователе:
    _Имя пользователя_: ${userInfo.name}
    _Номер телефона_: ${escapingCharacters(userInfo.phone_number)} ${formPermissions.userCanTalk ? "\\(\\+15 мин\\)" :""}
    _Организация_: ${escapingCharacters(userInfo.company)}
    _Номер компьютера в AnyDesk_: ${escapingCharacters(userInfo.number_pc)}
    
Информация о проблеме пользователя:
    _Проблемное устройство_: ${userProblemInfo.device}
    _Сообщение пользователя_: ${escapingCharacters(userMessage)}
    `

    const res = await bot.api.sendMessage(
        groupId,
        botMessage,
        {
            parse_mode: "MarkdownV2",
            protect_content: true
        }
    )
    const messageID = res.message_id

    // userProblemInfo.photo.forEach((file) => {
    //     file.arrayBuffer().then((buff) => {
    //         let newForm = new Uint8Array(buff)
    //         bot.api.sendPhoto(groupId, new InputFile(newForm))
    //     })
    // })

    /**
     * Отправка фотографий, как одно сообщение
     */
    if (userProblemInfo.photo.length) {
        const photoGroup: InputMediaPhoto[] = await Promise.all(
            userProblemInfo.photo.map(async (photo) => ({
                type: "photo",
                media: new InputFile(await photo.arrayBuffer().then((buff) => (new Uint8Array(buff))), photo.name),
                caption: `Photo name: ${photo.name}`
            }))
        )

        await bot.api.sendMediaGroup(groupId, photoGroup, {
            reply_parameters: {
                message_id: messageID,
                chat_id: groupId
            }
        })
    }

    /**
     * Отправка видео, как одно сообщение
     */
    if (userProblemInfo.video.length) {
        const photoGroup: InputMediaVideo[] = await Promise.all(
            userProblemInfo.video.map(async (video) => {
                const bufferVideo = await video.arrayBuffer()
                const uint8Array = new Uint8Array(bufferVideo)

                return {
                    type: "video",
                    media: new InputFile(uint8Array, video.name),
                    caption: `Video name: ${video.name}`
                }
            })
        )

        await bot.api.sendMediaGroup(groupId, photoGroup, {
            reply_parameters: {
                message_id: messageID,
                chat_id: groupId
            }
        })
    }

    /**
     * Отправка аудио
     */
    if (userProblemInfo.message_file) {
        const audioName = userProblemInfo.message_file.name
        const audioBuffer = await userProblemInfo.message_file.arrayBuffer()
        const uint8Array = new Uint8Array(audioBuffer)

        await bot.api.sendVoice(groupId, new InputFile(uint8Array, `${audioName}.ogg`), {
            reply_parameters: {
                message_id: messageID,
                chat_id: groupId
            }
        })
    }

    // await bot.api.sendMessage(groupId, "", {protect_content: true})

    webhookCallback(bot, 'std/http')

    return Response.json({
        message: "Заявка успешно отправлена и будет рассмотрена в ближайшее время. Спасибо за доверие!"
    })
}