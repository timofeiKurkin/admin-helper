import React, { FC } from 'react';
import FormPart from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPart/FormPart";
import styles from "./RootBodyBlock.module.scss"
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectBlocksMoving
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { RootPageContentType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';


interface PropsType {
    rootPageContent: RootPageContentType;
}

const RootBodyBlock: FC<PropsType> = ({ rootPageContent }) => {
    const blocksMoving = useAppSelector(selectBlocksMoving)

    return (
        <form
            className={`${styles.bodyBlockGrid} ${(blocksMoving.openedPhotoBlock || blocksMoving.openedVideoBlock) && styles.openedFileBlock}`}>
            <FormPart inputsContent={rootPageContent.formContent.formPartOne} />

            <div className={`${styles.separatingLine}`}></div>

            <FormPart inputsContent={rootPageContent.formContent.formPartTwo}
                permissionsContent={{
                    permissions: rootPageContent.permissionsContent,
                    button: rootPageContent.button!,
                }} />
        </form>
    );
};

export default RootBodyBlock;