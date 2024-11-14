import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { FC } from 'react'

interface PropsType extends ChildrenProp {
    trigger: boolean;
}

const OpacityAnimation: FC<PropsType> = ({ children, trigger }) => {
    const variants: Variants = {
        hidden: {
            opacity: 0, transition: { when: "afterChildren", type: "tween" }
        },
        visible: {
            opacity: 1, transition: { when: "beforeChildren", type: "tween" }
        },
    }

    return (
        <AnimatePresence>
            {trigger && (
                <motion.div style={{ width: "100%", height: "100%" }} variants={variants} initial={"hidden"} exit={"hidden"} animate={"visible"}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default OpacityAnimation