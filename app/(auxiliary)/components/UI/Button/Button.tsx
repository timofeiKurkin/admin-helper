import React, {CSSProperties, FC} from 'react';
import styles from "./Button.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";


interface PropsType {
    children?: React.ReactNode | string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    tabIndex?: number;
    onClick?: () => void;
    style?: CSSProperties;
    image?: {
        position?: "right" | "left";
        visibleOnlyImage: boolean;
        children: React.ReactNode;
    }
}

const Button: FC<PropsType> = ({
                                   children,
                                   type = "button",
                                   disabled = false,
                                   tabIndex,
                                   onClick,
                                   style,
                                   image = {}
                               }) => {
    return (
        <button type={type}
                className={styles.button}
                style={{
                    flexDirection: image?.position === "left" ? "row-reverse" : "row",
                    columnGap: image && !image.visibleOnlyImage ? "0.75rem" : 0,
                    ...style
                }}
                onPointerDownCapture={(e) => e.stopPropagation()}
                disabled={disabled}
                tabIndex={tabIndex}
                onClick={onClick}
        >
            {!image.visibleOnlyImage && (
                <ButtonText>
                    {children}
                </ButtonText>
            )}

            {Object.keys(image).length ? (
                image.children
            ) : null}
        </button>
    );
};

export default Button;