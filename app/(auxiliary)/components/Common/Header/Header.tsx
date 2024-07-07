"use client"

import React from 'react';
import Image from "next/image";
import styles from "./Header.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import data from "@/data/interface/header/data.json"
import {HeaderTypes} from "@/app/(auxiliary)/types/Data/Interface/Header/HeaderTypes";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";

const Header = () => {
    const headerData: HeaderTypes = data
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <div className={styles.logoWrapper}>
                    <Image src={headerData.logo.imageSrc}
                           alt={"logo"}
                           fill={true}
                           quality={100}
                           sizes={"100dvw"}/>
                </div>

                <Text style={{fontWeight: 500, letterSpacing: "0.01875rem"}}>{headerData.logo.title}</Text>
            </div>

            <div className={styles.repairServiceContainer}>
                <TextHighlighting wordIndexes={[0, 2]}
                                  link={headerData.repairService.linkToRepairService}>
                    <Text>{headerData.repairService.textToRepairService}</Text>
                </TextHighlighting>
            </div>
        </header>
    );
};

export default Header;