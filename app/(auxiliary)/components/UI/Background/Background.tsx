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
            backgroundClass = styles.background_success;
            break;
        case 'warning':
            backgroundClass = styles.background_warning;
            break;
        case 'error':
            backgroundClass = styles.background_error;
            break;
        default:
            backgroundClass = backgroundStyles.background_default
    }

    return (
        <div className={styles.backgroundWrapper}>
            <AnimatePresence initial={false}>
                <motion.div variants={variants}
                    key={serverResponse.status}
                    className={`${styles.backgroundWrapper} ${backgroundClass}`}
                    initial={"hidden"}
                    animate={"visible"}
                    transition={{ duration: .9, delay: 1 }}
                    exit={"exit"}></motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Background;