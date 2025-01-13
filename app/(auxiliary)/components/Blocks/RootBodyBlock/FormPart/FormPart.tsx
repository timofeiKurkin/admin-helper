import React, { FC, useEffect } from 'react';
import {
    FormPartType,
    PermissionsContentType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";
import FormBlock from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock";
import styles from "./FormPart.module.scss";
import Permissions from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/Permissions/Permissions";
import UploadForm from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/UploadForm/UploadForm";
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectDisableFormInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import { MouseEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes';


interface PropsType {
    inputsContent: FormPartType;
    permissionsContent?: {
        permissions: PermissionsContentType;
        button: string;
    }
}

const FormPart: FC<PropsType> = ({
    inputsContent,
    permissionsContent
}) => {
    const disableFormInputs = useAppSelector(selectDisableFormInputs)

    return (
        <div className={styles.formPartWrapper} style={{pointerEvents: disableFormInputs ? "none" : "auto"}}>
            <FormBlockWrapper>
                <TitleBlock>{inputsContent.title}</TitleBlock>

                <FormBlock inputContent={inputsContent.inputs}
                    formPartNumber={inputsContent.formPartNumber} />
            </FormBlockWrapper>

            {(inputsContent.formPartNumber && permissionsContent) ? (
                <div className={styles.permissionsAndSend}>
                    <div className={styles.permissions}>
                        <Permissions permissionsContent={permissionsContent.permissions} />
                    </div>

                    <div className={styles.send}>
                        <UploadForm buttonText={permissionsContent.button} />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FormPart;