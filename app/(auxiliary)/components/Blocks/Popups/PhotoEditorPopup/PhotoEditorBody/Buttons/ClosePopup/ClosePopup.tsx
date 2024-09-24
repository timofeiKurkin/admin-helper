import React, {FC} from 'react';
import {grey} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {changePopupVisibility} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

interface PropsType {
    data: string;
    type: PhotoAndVideoKeysTypes;
}

const ClosePopup: FC<PropsType> = ({data, type}) => {
    const dispatch = useAppDispatch()

    const closeEditorHandler = () => {
        dispatch(changePopupVisibility({type}))
    }

    return (
        <Button onClick={closeEditorHandler}
                style={{backgroundColor: grey}}>
            {data}
        </Button>
    );
};

export default ClosePopup;