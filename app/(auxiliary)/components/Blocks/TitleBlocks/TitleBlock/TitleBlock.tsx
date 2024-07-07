import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";

const TitleBlock: FC<ChildrenType> = ({children}) => {
    return (
        <Title>{children}</Title>
    );
};

export default TitleBlock;