"use client"

import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { HeaderTypes } from "@/app/(auxiliary)/types/Data/Interface/Header/HeaderTypes";
import data from "@/data/interface/header/data.json";
import Image from "next/image";
import Link from 'next/link';
import UserRequestsBlock from '../../Blocks/UserRequestsBlock/UserRequestsBlock';
import TextMedium from "../../UI/TextTemplates/TextMedium";
import styles from "./Header.module.scss";
import MobileHeader from './MobileHeader/MobileHeader';
import NotificationBlock from "../../Blocks/NotificationBlock/NotificationBlock";

const Header = () => {
    const userDevice = useAppSelector(selectUserDevice)
    const headerData: HeaderTypes = data

    return (
        <MobileHeader>
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <Link href={"/"} className={styles.logoWrapper} style={{ display: "flex" }}>
                            <Image src={headerData.logo.imageSrc}
                                alt={"logo"}
                                fill={true}
                                quality={100}
                                sizes={"100dvw"} />
                        </Link>
                    </div>

                    {!userDevice.phoneAdaptive ?
                        (<div className={styles.logoTitleDesktop}>
                            <TextMedium>
                                {headerData.logo.logoTitleDesktop}
                            </TextMedium>
                        </div>) :

                        (<div className={styles.logoTitleMobile}>
                            <TextMedium>
                                {headerData.logo.logoTitleMobile}
                            </TextMedium>
                        </div>)
                    }
                </div>

                <div className={styles.repairServiceContainer}>
                    <TextHighlighting wordIndexes={[0, 2]}
                        link={headerData.repairService.linkToRepairService}>
                        <Text>{headerData.repairService.textToRepairService}</Text>
                    </TextHighlighting>
                </div>

                <div className={styles.headerRequestBlock}>
                    {userDevice.phoneAdaptive ? <UserRequestsBlock /> : null}
                </div>

                <NotificationBlock />
            </div>
        </MobileHeader>
    )
};

export default Header;