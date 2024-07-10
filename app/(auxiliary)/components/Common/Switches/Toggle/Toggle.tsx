import React, {FC} from 'react';
import styles from "./Toggle.module.scss"
import ToggleSVG from "@/app/(auxiliary)/components/UI/SVG/Toggle/ToggleSVG";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

interface PropsType extends ChildrenType {
    toggleStatus: boolean;
    onClick: () => void;
}

const Toggle: FC<PropsType> = ({
                                   children,
                                   toggleStatus,
                                   onClick
                               }) => {
    return (
        <div className={styles.toggleWrapper} onClick={onClick}>
            <ToggleSVG toggleStatus={toggleStatus}/>

            <SmallText>{children}</SmallText>
        </div>
    );
};

export default Toggle;