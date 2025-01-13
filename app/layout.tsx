import AppWrapper from "@/app/(auxiliary)/components/Common/AppWrapper/AppWrapper";
import Header from "@/app/(auxiliary)/components/Common/Header/Header";
import Background from "@/app/(auxiliary)/components/UI/Background/Background";
import AppProvider from "@/app/(auxiliary)/libs/redux-toolkit/AppProvider";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { TTNormsProFont } from "@/font/font";
import styles from "@/styles/layout.module.scss";
import type { Metadata } from "next";
import NotificationBlock from "./(auxiliary)/components/Blocks/NotificationBlock/NotificationBlock";
import "./global.scss";
import CsrfToken from "./(auxiliary)/components/Common/AppWrapper/CsrfToken";
import CookiePermission from "./(auxiliary)/components/Common/AppWrapper/CookiePermission";


export const metadata: Metadata = {
    title: "IT-NK Service",
    description: "Создайте заявку на оказание технической помощи",
};


export default function RootLayout({ children }: Readonly<ChildrenProp>) {
    return (
        <html lang="ru">
            <body style={TTNormsProFont.style}
                className={styles.layoutBackground}>
                <AppProvider>
                    <>
                        <AppWrapper>
                            <CookiePermission>
                                <CsrfToken>
                                    <div className={styles.layoutWrapper}>
                                        <div className={styles.layoutContainer}>
                                            <Header />
                                            <main>
                                                {children}
                                            </main>
                                        </div>
                                        {/* <NotificationBlock /> */}
                                    </div>
                                </CsrfToken>
                            </CookiePermission>
                        </AppWrapper>
                        <Background />
                    </>
                </AppProvider>
            </body>
        </html>
    );
}
