import React, {CSSProperties, FC} from 'react';
import styles from "./Button.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";


interface ImageProps {
    position?: "right" | "left";
    visibleOnlyImage: boolean;
    children: React.ReactNode;
}


interface PropsType {
    children?: React.ReactNode | string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    tabIndex?: number;
    onClick?: () => void;
    style?: CSSProperties;
    image?: ImageProps
    buttonRef?: React.RefObject<HTMLButtonElement>;
    className?: string;
    loadingAnimation?: boolean;
}

const Button: FC<PropsType> = ({
                                   children,
                                   type = "button",
                                   disabled = false,
                                   tabIndex,
                                   onClick,
                                   style,
                                   image = {} as ImageProps,
                                   buttonRef,
                                   className,
                                   loadingAnimation = false
                               }) => {
    const imageStyles: CSSProperties = Object.keys(image).length ? {
        flexDirection: image.position === "left" ? "row-reverse" : "row",
        columnGap: !image.visibleOnlyImage ? "0.75rem" : 0,
    } : {} as CSSProperties

    return (
        <button type={type}
                ref={buttonRef}
                className={`${styles.button} ${className} ${loadingAnimation && styles.loadingAnimation}`}
                style={{
                    ...imageStyles,
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