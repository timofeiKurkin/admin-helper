import type { Metadata } from "next";
import "./global.scss";
import { TTNormsProFont } from "@/font/font";
import styles from "@/styles/layout.module.scss";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Header from "@/app/(auxiliary)/components/Common/Header/Header";
import Background from "@/app/(auxiliary)/components/UI/Background/Background";
import AppWrapper from "@/app/(auxiliary)/components/Common/AppWrapper/AppWrapper";
import AppProvider from "@/app/(auxiliary)/libs/redux-toolkit/AppProvider";
import ResetForm from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/ResetForm/ResetForm";
import NotificationBlock from "./(auxiliary)/components/Blocks/NotificationBlock/NotificationBlock";
import AuthorizeUser from "./(auxiliary)/components/Common/AuthorizeUser/AuthorizeUser";


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
                            <AuthorizeUser>
                                <ResetForm>
                                    <div className={styles.layoutWrapper}>
                                        <div className={styles.layoutContainer}>
                                            <Header />
                                            <main>
                                                {children}
                                            </main>
                                        </div>
                                        <NotificationBlock />
                                    </div>
                                </ResetForm>
                            </AuthorizeUser>
                        </AppWrapper>
                        <Background />
                    </>
                </AppProvider>
            </body>
        </html>
    );
}
