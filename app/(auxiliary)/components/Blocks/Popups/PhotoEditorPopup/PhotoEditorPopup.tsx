import React, {FC} from 'react';
import PhotoEditorData from "@/data/interface/photo-editor/data.json"
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import PhotoEditorBody from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/PhotoEditorBody";
import {PHOTO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import PopupsWrapper from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsWrapper";

const PhotoEditorPopup: FC = () => {
    const photoEditorData: PhotoEditorDataType = PhotoEditorData
    const photoInput = PHOTO_KEY

    return (
        <PopupsWrapper popupTitle={photoEditorData.title} type={photoInput}>
            <PhotoEditorBody data={photoEditorData}
                             type={photoInput}/>
        </PopupsWrapper>
    );
};

export default PhotoEditorPopup;