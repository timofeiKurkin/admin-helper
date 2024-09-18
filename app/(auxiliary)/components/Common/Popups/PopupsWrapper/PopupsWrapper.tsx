import React, {FC} from 'react';
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changeEditorVisibility
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import styles from "./PopupsWrapper.module.scss"
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";


interface PropsType {
    popupTitle: string;
    children: React.ReactNode;
}

const PopupsWrapper: FC<PropsType> = ({popupTitle, children}) => {
    const dispatch = useAppDispatch()
    const backDropClickHandler = () => {
        dispatch(changeEditorVisibility())
    }

    return (
        <Backdrop onBackdropClick={backDropClickHandler}>
            <div className={styles.popupWrapper}
                 onClick={(e) => e.stopPropagation()}>
                <div className={styles.popup}>
                    <div className={styles.popupTitle}>
                        <Title>{popupTitle}</Title>
                    </div>

                    {children}
                </div>
            </div>
        </Backdrop>
    );
};

export default PopupsWrapper;