import React, {FC, useRef, useState} from 'react';
import styles from "./PopupFileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import PopupFile from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFile/PopupFile";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectOpenedFileName} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import ArrowForList from "@/app/(auxiliary)/components/UI/SVG/ArrowForList/ArrowForList";

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
    const padAdaptive = useAppSelector(selectUserDevice).padAdaptive640_992

    const fileRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] =
        useState<number>(0)

    const nextFileHandler = () => {
        if (fileRef.current) {
            const width = fileRef.current.clientWidth
            setCurrentSlide((prevState) => prevState + width)
        }
    }

    const prevFileHandler = () => {
        if (fileRef.current) {
            const width = fileRef.current.clientWidth
            setCurrentSlide((prevState) => prevState - width)
        }
    }

    return (
        <div className={styles.photoListWrapper}>
            <Text>{titleOfList}</Text>

            {!padAdaptive ? (
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
            ) : (
                <div className={styles.slider}>
                    <div className={styles.sliderArrowLeft}
                         onClick={prevFileHandler}>
                        <ArrowForList className={styles.slideArrow}/>
                    </div>

                    <div className={styles.sliderListWrapper}>
                        <div className={styles.sliderList} style={{left: -currentSlide}}>
                            {listOfPreviews.map((file, index) => (
                                <div className={styles.currentSlide}
                                     ref={fileRef}
                                     key={`key=${index}`}>
                                    <PopupFile
                                        index={index}
                                        file={file}
                                        currentFileName={currentFileName}
                                        func={func}/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sliderArrowRight}
                         onClick={nextFileHandler}>
                        <ArrowForList className={styles.slideArrow}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(PopupFileList);