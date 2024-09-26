import React, {FC} from 'react';
import {blue_dark} from "@/styles/colors";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";

interface PropsType {
    data: string;
    saveSettings: () => void;
}

const SaveSettings: FC<PropsType> = ({data, saveSettings}) => {
    return (
        <Button style={{backgroundColor: blue_dark}}
                onClick={saveSettings}>
            {data}
        </Button>
    );
};

export default SaveSettings;