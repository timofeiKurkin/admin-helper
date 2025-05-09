import React, { FC, useEffect } from 'react';

interface PropsType {
    children: React.ReactNode;
}

const PopupDisableScroll: FC<PropsType> = ({ children }) => {
    useEffect(() => {
        document.body.style.overflowY = "hidden"

        return () => {
            document.body.style.overflowY = "auto"
        }
    }, []);

    return children
};

export default PopupDisableScroll;