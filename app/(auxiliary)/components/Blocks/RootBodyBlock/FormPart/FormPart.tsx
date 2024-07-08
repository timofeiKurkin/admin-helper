import React, {FC} from 'react';
import {FormPartType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";
import FormBlock from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock";


interface PropsType {
    content: FormPartType;
}

const FormPart: FC<PropsType> = ({content}) => {
    return (
        <FormBlockWrapper>
            <TitleBlock>{content.title}</TitleBlock>

            <FormBlock inputContent={content.inputs}
                       formPartNumber={content.formPartNumber}/>
        </FormBlockWrapper>
    );
};

export default FormPart;