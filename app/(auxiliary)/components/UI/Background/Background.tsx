import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import backgroundStyles from "@/styles/variables.module.scss";

const Background: FC<ChildrenType> = ({children}) => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
        }} className={backgroundStyles.background}>
            {children}
        </div>
    );
};

export default Background;