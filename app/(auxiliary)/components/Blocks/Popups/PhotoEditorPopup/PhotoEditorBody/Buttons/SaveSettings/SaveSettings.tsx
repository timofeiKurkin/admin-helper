import React from 'react';
import {blue_dark} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {changePreview} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoSettings,
    changePopupVisibility
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";

interface PropsType<SettingsType> {
    // settingsForSaving: PhotoEditorSettingsType;
    data: string;
    saveSettings: () => void;

    // type: PhotoAndVideoKeysTypes;
    // settingsForSaving?: SettingsType;
    // finallyOfFiles: File[]; // Список файлов для обновления
}

const SaveSettings = <SettingsType extends PhotoEditorSettingsType[]>({
                                                                          data,
                                                                          saveSettings,

                                                                          // settingsForSaving,
                                                                          // type,
                                                                          // finallyOfFiles = []
                                                                      }: PropsType<SettingsType>) => {
    // const dispatch = useAppDispatch()

    /**
     * Сохранить настройки фотографий и закрыть редактор
     * @param settings
     */
    // const saveSettingsHandler = (settings?: SettingsType) => {
    //     // console.log("settings for saving: ", settings)
    //     if (type === PHOTO_KEY && settings) {
    //         /**
    //          * Изменение preview у всего списка фотографий
    //          */
    //         dispatch(changePreview({
    //             key: type,
    //             data: finallyOfFiles
    //         }))
    //
    //         /**
    //          * Сохранение всех настроек для каждого фото
    //          */
    //         dispatch(changePhotoSettings(settings))
    //         dispatch(changePopupVisibility({type}))
    //     } else if (type === VIDEO_KEY) {
    //
    //     }
    // }

    return (
        <Button style={{backgroundColor: blue_dark}}
                onClick={saveSettings}>
            {data}
        </Button>
    );
};

export default SaveSettings;