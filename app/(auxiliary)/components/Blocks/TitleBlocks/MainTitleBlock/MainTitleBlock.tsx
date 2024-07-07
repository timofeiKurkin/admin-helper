import React, {FC} from 'react';
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const MainTitleBlock: FC<ChildrenType> = ({children}) => {
    return (
        <MainTitle>{children}</MainTitle>
    );
};

export default MainTitleBlock;