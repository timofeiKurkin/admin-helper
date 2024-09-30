import React, {FC, useEffect} from 'react';

interface PropsType {
    children: React.ReactNode;
}

const PopupScroll: FC<PropsType> = ({children}) => {
    useEffect(() => {
        document.body.style.overflowY = "hidden"

        return () => {
            document.body.style.overflowY = "auto"
        }
    }, []);

    return children
};

export default PopupScroll;