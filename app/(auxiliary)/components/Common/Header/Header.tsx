"use client"

import React from 'react';
import Image from "next/image";
import styles from "./Header.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";

const Header = () => {
    return (
        <div>
            <div className={styles.logoWrapper}>
                <Image src={"/logo.png"} alt={"logo"} fill={true} quality={100}/>
            </div>

            <Text>Быстрая помощь в решении сложных проблем!</Text>
        </div>
    );
};

export default Header;