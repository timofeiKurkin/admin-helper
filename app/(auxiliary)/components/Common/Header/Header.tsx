"use client"

import React from 'react';
import Image from "next/image";
import styles from "./Header.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import data from "@/data/interface/header/data.json"
import { HeaderTypes } from "@/app/(auxiliary)/types/Data/Interface/Header/HeaderTypes";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import Link from 'next/link';
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import UserRequestsBlock from '../../Blocks/UserRequestsBlock/UserRequestsBlock';
import MobileHeader from './MobileHeader/MobileHeader';
import { useWindowSize } from '@/app/(auxiliary)/hooks/useWindowSize';

const Header = () => {
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive
    const size = useWindowSize()
    const headerData: HeaderTypes = data

    return !phoneAdaptive ? (
        <div className={`${styles.headerDesktop} ${styles.header}`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoWrapper}>
                    <Link href={"/"}>
                        <Image src={headerData.logo.imageSrc}
                            alt={"logo"}
                            fill={true}
                            quality={100}
                            sizes={"100dvw"} />
                    </Link>
                </div>

                <div className={styles.logoContainerText}>
                    <Text style={{ fontWeight: 500, letterSpacing: "0.01875rem", lineHeight: "1.4375rem" }}>
                        {headerData.logo.title}
                    </Text>
                </div>
            </div>

            <div className={styles.repairServiceContainer}>
                <TextHighlighting wordIndexes={[0, 2]}
                    link={headerData.repairService.linkToRepairService}>
                    <Text>{headerData.repairService.textToRepairService}</Text>
                </TextHighlighting>
            </div>
        </div>
    ) : (
        <MobileHeader>
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <Link href={"/"}>
                            <Image src={headerData.logo.imageSrc}
                                alt={"logo"}
                                fill={true}
                                quality={100}
                                sizes={"100dvw"} />
                        </Link>
                    </div>
                </div>

                <UserRequestsBlock />
            </div>
        </MobileHeader>
    )
};

export default Header;