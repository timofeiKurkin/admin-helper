import React, {FC} from 'react';
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {changePopupVisibility} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import styles from "./PopupsWrapper.module.scss"
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


interface PropsType {
    popupTitle: string;
    children: React.ReactNode;
    type: PhotoAndVideoKeysTypes;
}

const PopupsWrapper: FC<PropsType> = ({
                                          popupTitle,
                                          children,
                                          type
                                      }) => {
    const dispatch = useAppDispatch()
    const backDropClickHandler = () => {
        dispatch(changePopupVisibility({type}))
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