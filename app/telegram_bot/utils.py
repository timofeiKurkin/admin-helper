def get_finally_message(
    *,
    last_index: int,
    name: str,
    phone: str,
    company: str,
    number_pc: int,
    device: str,
    message_text: str,
):
    user_message = f"\n    Сообщение пользователя: {message_text}" if message_text else ""
    
    return (
        f"Новая заявка о технической помощи - <b>#{last_index}</b>\n\n"
        + "Информация о пользователе:\n"
        + f"    Имя пользователя: {name}\n"
        + f"    Номер телефона: {phone}\n"
        + f"    Организация: {company}\n"
        + f"    Номер компьютера в AnyDesk: {number_pc}\n\n"
        + "Информация о проблеме пользователя:\n"
        + f"    Проблемное устройство: {device} {user_message}"
    )
