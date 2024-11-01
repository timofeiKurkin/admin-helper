import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import React, { FC, useEffect, useState } from 'react'
import styles from "./MobileHeader.module.scss"

const MobileHeader: FC<ChildrenProp> = ({ children }) => {
    const [headerVisible, setHeaderVisible] = useState<boolean>(true)
    const [lastScrollY, setLastScrollY] = useState<number>(0)

    const scrollHandler = () => {
        const currentScroll = window.scrollY

        if (currentScroll > lastScrollY && currentScroll > 50) {
            setHeaderVisible(false)
        } else {
            setHeaderVisible(true)
        }
        setLastScrollY(currentScroll)
    }

    useEffect(() => {
        if (window !== undefined) {
            window.addEventListener("scroll", scrollHandler)

            return () => {
                window.removeEventListener("scroll", scrollHandler)
            }
        }

    }, [lastScrollY])

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