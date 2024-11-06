import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import React, { FC, useCallback, useEffect, useState } from 'react'
import styles from "./MobileHeader.module.scss"
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'

const MobileHeader: FC<ChildrenProp> = ({ children }) => {
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive
    const [headerVisible, setHeaderVisible] = useState<boolean>(true)
    const [lastScrollY, setLastScrollY] = useState<number>(0)

    const scrollHandler = useCallback(() => {
        const currentScroll = window.scrollY

        if (currentScroll > lastScrollY && currentScroll > 70) {
            setHeaderVisible(false)
        } else {
            setHeaderVisible(true)
        }
        setLastScrollY(currentScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (window !== undefined && phoneAdaptive) {
            window.addEventListener("scroll", scrollHandler)

            return () => {
                window.removeEventListener("scroll", scrollHandler)
            }
        }
    }, [lastScrollY, phoneAdaptive, scrollHandler])

    return (
        <header className={styles.mobileHeaderWrapper} style={{
            transition: "transform 0.3s ease",
            transform: headerVisible ? "translateY(0)" : "translateY(-100%)"
        }}>
            {children}
        </header>
    )
}

export default MobileHeader