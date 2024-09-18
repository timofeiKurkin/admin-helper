import React, {FC} from 'react';
import styles from "./PopupFileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import PopupFile from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFile/PopupFile";

interface PropsType {
    contentForEditor: {
        titleOfList: string;
        listOfPreviews: File[];
        type: PhotoAndVideoKeysTypes;
        switchToAnotherFile: (fileName: string) => void;
    }
}

const PopupFileList: FC<PropsType> = ({
                                          contentForEditor
                                      }) => {

    return (
        <div className={styles.photoListWrapper}>
            <Text>{contentForEditor.titleOfList}</Text>

            <div className={styles.photoList}>
                <div className={styles.photoListScroll} style={{
                    gridTemplateRows: `repeat(${contentForEditor.listOfPreviews.length}, 4rem)`
                }}>
                    {contentForEditor.listOfPreviews.map((file, index) => {
                        return (
                            <PopupFile key={`key=${index}`}
                                       file={file}
                                       index={index}
                                       type={contentForEditor.type}
                                       switchToAnotherFile={contentForEditor.switchToAnotherFile}/>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default PopupFileList;