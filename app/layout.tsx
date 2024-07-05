import type {Metadata} from "next";
import "./global.scss";
import {TTNormsProFont} from "@/font/font";
import styles from "@/styles/layout.module.scss";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Header from "@/app/(auxiliary)/components/Common/Header/Header";

export const metadata: Metadata = {
    title: "IT-NK Service",
    description: "Создайте заявку на оказание технической помощи",
};


export default function RootLayout({children}: Readonly<ChildrenType>) {
    return (
        <html lang="ru">
        <body style={TTNormsProFont.style}
              className={styles.layoutBackground}>
        <div className={styles.layoutWrapper}>
            <div className={styles.layoutContainer}>
                <Header/>
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}
