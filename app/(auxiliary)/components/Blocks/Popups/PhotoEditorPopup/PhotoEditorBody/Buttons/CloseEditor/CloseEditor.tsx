import React, {FC} from 'react';
import {grey} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {changePhotoEditorVisibility} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";

interface PropsType {
    data: string;
}

const CloseEditor: FC<PropsType> = ({data}) => {
    const dispatch = useAppDispatch()

    const closeEditorHandler = () => {
        dispatch(changePhotoEditorVisibility())
    }

    return (
        <Button onClick={closeEditorHandler}
                style={{backgroundColor: grey}}>
            {data}
        </Button>
    );
};

export default CloseEditor;