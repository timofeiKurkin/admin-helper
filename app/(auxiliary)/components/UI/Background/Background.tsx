import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import backgroundStyles from "@/styles/variables.module.scss";

const Background: FC<ChildrenType> = ({children}) => {
    return (
        <div className={backgroundStyles.background}>
            {children}
        </div>
    );
};

export default Background;