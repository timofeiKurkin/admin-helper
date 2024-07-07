import React, {FC} from 'react';
import {FormPartOneType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import TitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/TitleBlock/TitleBlock";
import FormBlockWrapper from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormBlockWrapper";

interface PropsType {
    content: FormPartOneType;
}

const FormPartTwo: FC<PropsType> = ({content}) => {
    return (
        <div>
            <FormBlockWrapper>
                <TitleBlock>{content.title}</TitleBlock>

                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet consequuntur culpa dolor dolores dolorum, et fugiat illum in ipsum iste minus nisi optio pariatur quidem, soluta voluptatum. Dignissimos, minima!</div>
            </FormBlockWrapper>
        </div>
    );
};

export default FormPartTwo;