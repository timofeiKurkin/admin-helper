import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import React, { FC, useState } from 'react'
import { AnimatePresence, motion, Variants } from "framer-motion"
import styles from "../InputWithDataList.module.scss";
import Text from '../../../TextTemplates/Text';


interface PropsType extends ChildrenProp {
    currentHelpfulList: string[];
    chooseHelpfulItem: (newItem: string) => void;
    inputIsDirty: boolean;
}

const HelpfulList: FC<PropsType> = ({
    children,
    currentHelpfulList,
    chooseHelpfulItem,
    inputIsDirty
}) => {
    const [listVisibility, setListVisibility] = useState<boolean>(inputIsDirty)
    const listVisibilityHandler = () => {
        setListVisibility((prevState) => !prevState)
    }

    const variants: Variants = {
        hidden: {
            opacity: 0, y: "-10%", transition: { when: "afterChildren" }
        },
        visible: {
            opacity: 1, y: 0, transition: { when: "beforeChildren" }
        },
    }

    return (
        <div className={styles.inputWrapper}
            tabIndex={-1}
            onFocus={() => listVisibilityHandler()}
            onBlur={() => listVisibilityHandler()}>
            {children}

            <AnimatePresence>
                {
                    (currentHelpfulList.length && listVisibility) ? (
                        <motion.ul className={styles.helpfulList}
                            variants={variants}
                            initial={"hidden"}
                            animate={"visible"}
                            exit={"hidden"}>
                            {currentHelpfulList.map((item, index) => (
                                <li key={`key=${index}`} className={styles.helpfulItem} onClick={() => chooseHelpfulItem(item)}>
                                    <Text>
                                        {item}
                                    </Text>
                                </li>
                            ))}
                        </motion.ul>
                    ) : null
                }
            </AnimatePresence>
        </div>
    )
}

export default HelpfulList