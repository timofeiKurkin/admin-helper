def get_finally_message(
    *,
    last_index: int,
    name: str,
    phone: str,
    company: str,
    number_pc: int,
    device: str,
    message_text: str,
    user_can_talk: bool,
):
    user_message = (
        f"\n    Сообщение пользователя: {message_text}" if message_text else ""
    )

    return (
        f"Заявка о технической помощи - <b>#{last_index}</b>\n\n"
        + "Информация о пользователе:\n"
        + f"    <b>Имя пользователя</b>: {name}\n"
        + f"    <b>Номер телефона</b>: {''.join(phone.split(" "))}{' (+15 мин)' if user_can_talk else ""}\n"
        + f"    <b>Организация</b>: {company}\n"
        + f"    <b>Номер компьютера в AnyDesk</b>: <code>{number_pc}</code>\n\n"
        + "Информация о проблеме пользователя:\n"
        + f"    <b>Проблемное устройство</b>: {device} {user_message}"
    )
