import React, { FC, useEffect, useState } from 'react';
import { PhotoAndVideoInputType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import styles from "./FileInput.module.scss";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import { PHOTO_KEY, PhotoAndVideoKeysType, VIDEO_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectUserDevice,
    setOpenedPhotoBlock,
    setOpenedVideoBlock,
    setSwitchedMessageBlock
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import HaveMediaFile
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/HaveMediaFile/HaveMediaFile";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";


interface PropsType {
    input: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({ input }) => {
    const dispatch = useAppDispatch()
    const userDevice = useAppSelector(selectUserDevice)
    const serverResponse = useAppSelector(selectServerResponse).status

    const [haveMediaFile, setHaveMediaFile] =
        useState<boolean>(false)

    const fileBlockHandler = () => {
        setHaveMediaFile((prevState) => !prevState)

        if (userDevice.padAdaptive640_992) {
            dispatch(setSwitchedMessageBlock(!haveMediaFile))
        } else {
            if (input.type === PHOTO_KEY) {
                dispatch(setOpenedPhotoBlock(!haveMediaFile))
            }

            if (input.type === VIDEO_KEY) {
                dispatch(setOpenedVideoBlock(!haveMediaFile))
            }
        }
    }

    useEffect(() => {
        if (serverResponse === "success") {
            setHaveMediaFile(false)
        }
    }, [serverResponse])

    return (
        <div className={styles.fileInputWrapper}>
            <Toggle toggleStatus={haveMediaFile}
                onClick={fileBlockHandler}>
                {input.toggleText}
            </Toggle>

            {haveMediaFile && (
                <HaveMediaFile inputData={{
                    type: input.type as PhotoAndVideoKeysType,
                    button: input.button || "",
                    placeholder: input.inputPlaceholder || ""
                }} />
            )}
        </div>
    );
};

export default FileInput;