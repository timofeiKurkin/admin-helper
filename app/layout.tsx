import type {Metadata} from "next";
import "./global.scss";
import {TTNormsProFont} from "@/font/font";
import styles from "@/styles/layout.module.scss";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Header from "@/app/(auxiliary)/components/Common/Header/Header";
import Background from "@/app/(auxiliary)/components/UI/Background/Background";
import Provider from "@/app/(auxiliary)/components/Common/Provider/Provider";
import AppWrapper from "@/app/(auxiliary)/components/Common/AppWrapper/AppWrapper";
import {cookies} from "next/headers";


export const metadata: Metadata = {
    title: "IT-NK Service",
    description: "Создайте заявку на оказание технической помощи",
};


export default function RootLayout({children}: Readonly<ChildrenType>) {
    const cookiesStore = cookies()
    const CSRFTokenFromCookie = cookiesStore.get('csrf_token' as any)
    const CSRFToken = CSRFTokenFromCookie?.value || ""

    return (
        <html lang="ru">
        <body style={TTNormsProFont.style}
              className={styles.layoutBackground}>
        <Background>
            <Provider>
                <AppWrapper CSRFToken={CSRFToken}>
                    <div className={styles.layoutWrapper}>
                        <div className={styles.layoutContainer}>
                            <Header/>
                            <main>
                                {children}
                            </main>
                        </div>
                    </div>
                </AppWrapper>
            </Provider>
        </Background>
        </body>
        </html>
    );
}
