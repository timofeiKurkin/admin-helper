import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {background} from "@/styles/colors";

const Background: FC<ChildrenType> = ({children}) => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            background: background
        }}>
            {children}
        </div>
    );
};

export default Background;