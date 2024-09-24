import React from 'react';
import {blue_dark} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePreview, deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoSettings,
    changePopupVisibility
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {arrayDifference} from "@/app/(auxiliary)/func/editorHandlers";

interface PropsType<SettingsType> {
    // settingsForSaving: PhotoEditorSettingsType;
    data: string;
    type: PhotoAndVideoKeysTypes;
    settingsForSaving?: SettingsType;
    listOfFiles: File[]; // Список файлов для обновления
}

const SaveSettings = <SettingsType extends PhotoEditorSettingsType[]>({
                                                                          data,
                                                                          settingsForSaving,
                                                                          type,
                                                                          listOfFiles = []
                                                                      }: PropsType<SettingsType>) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)[type]

    /**
     * Сохранить настройки фотографий и закрыть редактор
     * @param settings
     */
    const saveSettingsHandler = (settings?: SettingsType) => {
        if (type === PHOTO_KEY && settings) {
            // const difference = arrayDifference(formFileData.files, listOfFiles)
            // difference.forEach((file) => {
            //     dispatch(deleteFile({
            //         key: type,
            //         data: file
            //     }))
            // })

            /**
             * Изменение preview у всего списка фотографий
             */
            dispatch(changePreview({
                key: type,
                data: listOfFiles
            }))

            /**
             * Сохранение всех настроек для каждого фото
             */
            dispatch(changePhotoSettings(settings))
            dispatch(changePopupVisibility({type}))
        } else if (type === VIDEO_KEY) {

        }
    }

    return (
        <Button style={{backgroundColor: blue_dark}}
                onClick={() => saveSettingsHandler(settingsForSaving)}>
            {data}
        </Button>
    );
};

export default SaveSettings;