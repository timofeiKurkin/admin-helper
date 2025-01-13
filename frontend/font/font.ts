import localFont from "next/font/local"

export const TTNormsProFont = localFont({
    variable: "--TTNormsPro",
    display: "swap",
    src: [
        {
            path: "./TT-Norms-Pro/TTNormsPro-Bold.woff2",
            weight: "700",
            style: "normal"
        },
        {
            path: "./TT-Norms-Pro/TTNormsPro-Medium.woff2",
            weight: "500",
            style: "normal"
        },
        {
            path: "./TT-Norms-Pro/TTNormsPro-Regular.woff2",
            weight: "400",
            style: "normal"
        }
    ]
})
