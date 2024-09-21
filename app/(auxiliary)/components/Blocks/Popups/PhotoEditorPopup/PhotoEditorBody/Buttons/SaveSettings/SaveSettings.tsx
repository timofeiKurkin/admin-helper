import React, {FC} from 'react';
import {blue_dark} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {PHOTO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {changePreview} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoEditorVisibility,
    changePhotoSettings
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";

interface PropsType {
    data: string;
    saveFuncArgs: PhotoEditorSettingsType;
    listOfPreviews: File[];
}

const SaveSettings: FC<PropsType> = ({
                                         data,
                                         saveFuncArgs,
                                         listOfPreviews
                                     }) => {
    const dispatch = useAppDispatch()

    /**
     * Сохранить настройки фотографий и закрыть редактор
     * @param settings
     */
    const saveSettingsHandler = (settings: PhotoEditorSettingsType) => {
        /**
         * Изменение preview у всего списка фотографий
         */
        dispatch(changePreview({
            key: PHOTO_KEY,
            data: listOfPreviews
        }))
        /**
         * Сохранение всех настроек для каждого фото
         */
        dispatch(changePhotoSettings(settings))
        dispatch(changePhotoEditorVisibility())
    }

    return (
        <Button style={{backgroundColor: blue_dark}}
                onClick={() => saveSettingsHandler(saveFuncArgs)}>
            {data}
        </Button>
    );
};

export default SaveSettings;