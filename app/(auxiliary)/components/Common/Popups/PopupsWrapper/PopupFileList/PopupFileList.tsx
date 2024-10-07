import React, {FC, useState} from 'react';
import styles from "./PopupFileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import PopupFile from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFile/PopupFile";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectOpenedFileName} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import ArrowForList from "@/app/(auxiliary)/components/UI/SVG/ArrowForList/ArrowForList";
import {findElement} from "@/app/(auxiliary)/func/editorHandlers";
import {CustomFile} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";

interface PropsType {
    titleOfList: string;
    listOfPreviews: CustomFile[];
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

    // const fileRef = useRef<HTMLDivElement>(null)
    // const [currentSlide, setCurrentSlide] = useState<number>(0)

    // const nextFileHandler = () => {
    //     if (fileRef.current) {
    //         const width = fileRef.current.clientWidth
    //         const lastItemWidth = (width * listOfPreviews.length) - width
    //         if (currentSlide !== lastItemWidth) {
    //             setCurrentSlide((prevState) => prevState + width)
    //             const nextIndexSlide = (currentSlide + width) / width
    //             func.switchToAnotherFile(listOfPreviews[nextIndexSlide].name)
    //         }
    //     }
    // }

    // const prevFileHandler = () => {
    //     if (fileRef.current) {
    //         const width = fileRef.current.clientWidth
    //         if (currentSlide) {
    //             setCurrentSlide((prevState) => prevState - width)
    //             const prevIndexSlide = (currentSlide - width) / width
    //             func.switchToAnotherFile(listOfPreviews[prevIndexSlide].name)
    //         }
    //     }
    // }

    const [currentSlide, setCurrentSlide] =
        useState<CustomFile>(() => listOfPreviews.find((f) => findElement(f, currentFileName))!)

    const nextFileHandler = () => {
        if (currentSlide.id + 1 == listOfPreviews.length) return

        const nextItemID = currentSlide.id + 1
        func.switchToAnotherFile(listOfPreviews[nextItemID].name)
        setCurrentSlide(listOfPreviews[nextItemID])
    }

    const prevFileHandler = () => {
        if (!currentSlide.id) return

        const prevItemID = currentSlide.id - 1
        const prevItem = listOfPreviews[prevItemID]

        if (prevItem && prevItem instanceof File) {
            func.switchToAnotherFile(listOfPreviews[prevItemID].name)
            setCurrentSlide(listOfPreviews[prevItemID])
        }
    }

    return (
        <div className={styles.photoListWrapper}>
            <Text>{titleOfList}</Text>

            {padAdaptive ? (
                <div className={styles.slider}>
                    <div className={styles.sliderArrowLeft}
                         onClick={prevFileHandler}>
                        <ArrowForList className={styles.slideArrow}
                                      activeStatus={!!currentSlide.id}/>
                    </div>

                    <div className={styles.sliderListWrapper}>
                        {/*<div className={styles.sliderList} style={{left: -currentSlide}}>*/}
                        {/*    {listOfPreviews.map((file, index) => (*/}
                        {/*        <div className={styles.currentSlide}*/}
                        {/*             ref={fileRef}*/}
                        {/*             key={`key=${index}`}>*/}
                        {/*            <PopupFile*/}
                        {/*                index={index}*/}
                        {/*                file={file}*/}
                        {/*                currentFileName={currentFileName}*/}
                        {/*                func={func}/>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}

                        <div className={styles.currentSlide}>
                            <PopupFile index={currentSlide.id}
                                       file={currentSlide}
                                       currentFileName={currentFileName}
                                       func={func}/>
                        </div>
                    </div>

                    <div className={styles.sliderArrowRight}
                         onClick={nextFileHandler}>
                        <ArrowForList className={styles.slideArrow}
                                      activeStatus={listOfPreviews.length > 1 && currentSlide.id !== listOfPreviews.length - 1}/>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default React.memo(PopupFileList);