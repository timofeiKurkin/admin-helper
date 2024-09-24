import React, {FC} from 'react';
import styles from "./PopupFileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import PopupFile from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFile/PopupFile";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectOpenedFileName} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";

interface PropsType {
    titleOfList: string;
    listOfPreviews: File[];
    func: {
        switchToAnotherFile: (fileName: string) => void;
        removeFile: (fileName: string) => void;
    }
}

const PopupFileList: FC<PropsType> = ({
                                          titleOfList,
                                          listOfPreviews,
                                          func
                                      }) => {
    const currentFileName = useAppSelector(selectOpenedFileName)

    return (
        <div className={styles.photoListWrapper}>
            <Text>{titleOfList}</Text>

            <div className={styles.photoList}>
                <div className={styles.photoListScroll} style={{
                    gridTemplateRows: `repeat(${listOfPreviews.length}, 4rem)`
                }}>
                    {listOfPreviews.map((file, index) => (
                        <PopupFile key={`key=${index}`}
                                   file={file}
                                   currentFileName={currentFileName}
                                   index={index}
                                   func={func}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(PopupFileList);