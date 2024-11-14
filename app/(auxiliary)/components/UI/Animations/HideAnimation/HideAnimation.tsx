import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { FC } from 'react'

interface PropsType extends ChildrenProp {
    trigger: boolean;
}

const HideAnimation: FC<PropsType> = ({ children, trigger }) => {

    const variants: Variants = {
        "visible": {
            opacity: 1, height: "auto"
        },
        "hidden": {
            opacity: 0, height: 0
        },
        "exit": {
            opacity: 0, height: 0
        }
    }

    return (
        <AnimatePresence initial={false} mode='wait'>
            {trigger && (
                <motion.div variants={variants} initial={"hidden"} exit={"exit"} animate={"visible"}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default HideAnimation