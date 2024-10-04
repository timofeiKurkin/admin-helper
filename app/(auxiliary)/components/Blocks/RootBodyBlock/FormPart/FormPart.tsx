import React, {FC, useEffect} from 'react';
import {
    FormPartType,
    PermissionsContentType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";
import FormBlock from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock";
import styles from "./FormPart.module.scss";
import Permissions from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/Permissions/Permissions";
import UploadForm from "@/app/(auxiliary)/components/Blocks/FormBlock/UploadForm/UploadForm";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";


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
    const serverResponse = useAppSelector(selectServerResponse)

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
                        <UploadForm buttonText={permissionsContent.button}/>
                    </div>

                    {serverResponse.sentToServer ? (
                        <div className={styles.serverResponse}>
                            <Text>{serverResponse.message}</Text>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default FormPart;