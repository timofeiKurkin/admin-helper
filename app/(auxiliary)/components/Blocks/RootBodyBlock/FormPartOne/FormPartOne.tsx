import React, {FC} from 'react';
import {FormPartOneType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";
import FormBlock from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock";


interface PropsType {
    content: FormPartOneType;
}

const FormPartOne: FC<PropsType> = ({content}) => {
    return (
        <FormBlockWrapper>
            <TitleBlock>{content.title}</TitleBlock>

            <FormBlock inputContent={content.inputs}/>
        </FormBlockWrapper>
    );
};

export default FormPartOne;