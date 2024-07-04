import type { Metadata } from "next";
import { TTNormsProFont } from "@/font/font";

export const metadata: Metadata = {
  title: "IT-NK Service",
  description: "Создайте заявку на оказание технической помощи",
};

interface PropsType {
  children: React.ReactNode;
}

export default function RootLayout({children}: Readonly<PropsType>) {
  return (
    <html lang="ru">
      <body className={TTNormsProFont.className}>{children}</body>
    </html>
  );
}
