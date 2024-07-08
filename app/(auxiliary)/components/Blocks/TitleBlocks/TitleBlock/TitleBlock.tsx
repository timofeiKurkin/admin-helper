import React, {CSSProperties, FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";

interface PropsType extends ChildrenType{
    styles?: CSSProperties;
}

const TitleBlock: FC<PropsType> = ({children, styles}) => {
    return (
        <Title styles={styles}>{children}</Title>
    );
};

export default TitleBlock;