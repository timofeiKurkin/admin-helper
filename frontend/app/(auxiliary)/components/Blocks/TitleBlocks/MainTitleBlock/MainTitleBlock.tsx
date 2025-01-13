import React, { FC } from 'react';
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const MainTitleBlock: FC<ChildrenProp> = ({ children }) => {
    return (
        <MainTitle>{children}</MainTitle>
    );
};

export default MainTitleBlock;