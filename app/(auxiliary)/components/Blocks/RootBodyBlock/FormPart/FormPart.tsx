import React, {FC} from 'react';
import {FormPartType, PermissionsContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";
import FormBlock from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock";
import styles from "./FormPart.module.scss";
import Permissions from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/Permissions/Permissions";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import FormUserDataUpload from "@/app/(auxiliary)/components/Blocks/FormBlock/FormUserDataUpload/FormUserDataUpload";


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
    return (
        <div className={styles.formPartWrapper}>
            <FormBlockWrapper>
                <TitleBlock>{inputsContent.title}</TitleBlock>

                <FormBlock inputContent={inputsContent.inputs}
                           formPartNumber={inputsContent.formPartNumber}/>
            </FormBlockWrapper>

            {(inputsContent.formPartNumber && permissionsContent) ? (
                <div className={styles.permissionsAndSend}>
                    <div className={styles.permissions}>
                        <Permissions permissionsContent={permissionsContent.permissions}/>
                    </div>

                    <div className={styles.send}>
                        <FormUserDataUpload buttonText={permissionsContent.button}/>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FormPart;