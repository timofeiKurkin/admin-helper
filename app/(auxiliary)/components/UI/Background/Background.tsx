"use client"

import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import backgroundStyles from "@/styles/variables.module.scss";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FC } from 'react';
import styles from "./Background.module.scss";

const Background: FC = () => {

    const serverResponse = useAppSelector(selectServerResponse)

    const variants: Variants = {
        "visible": {
            opacity: 1,
        },
        "hidden": {
            opacity: 0,
        },
        "exit": {
            opacity: 0,
        }
    }

    let backgroundClass

    switch (serverResponse.status) {
        case 'success':
            backgroundClass = backgroundStyles.background_success;
            break;
        case 'warning':
            backgroundClass = backgroundStyles.background_warning;
            break;
        case 'error':
            backgroundClass = backgroundStyles.background_error;
            break;
        default:
            backgroundClass = backgroundStyles.background_default
    }

    // const dispatch = useAppDispatch()
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         dispatch(setServerResponse({
    //             message: "123",
    //             "sentToServer": true,
    //             "status": "warning"
    //         }))
    //     }, 2000)

    //     return () => {
    //         clearTimeout(timer)
    //     }
    // }, [])

    return (
        <div className={styles.backgroundWrapper}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div variants={variants}
                    key={serverResponse.status}
                    className={`${styles.background} ${backgroundClass}`}
                    initial={"hidden"}
                    animate={"visible"}
                    transition={{ duration: .5, }}
                    exit={"exit"}></motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Background;