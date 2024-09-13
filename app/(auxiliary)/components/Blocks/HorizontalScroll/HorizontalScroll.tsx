import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import styles from "./HorizontalScroll.module.scss";
import ArrowForList from "@/app/(auxiliary)/components/UI/SVG/ArrowForList/ArrowForList";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import FilePreview
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/FilePreview";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";

interface PropsType {
    filesListLength: number;
    placeholder: string;
    currentFilesList: FileListStateType;
    removeFile: (fileName: string) => void;
    changeFile: (fileName: string) => void;
}

const HorizontalScroll: FC<PropsType> = ({
                                             filesListLength,
                                             placeholder,
                                             currentFilesList,
                                             removeFile,
                                             changeFile
                                         }) => {
    /**
     * Custom scroll
     */
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const scrollThumbRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] =
        useState(false)
    const [scrollPosition, setScrollPosition] =
        useState(0)
    const [scrollThumbWidth, setScrollThumbWidth] =
        useState(0)
    const [endOfList, setEndOfList] = useState<boolean>(true)

    const arrowMoveStep = 70

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        /**
         * Вычисляем ширину ползунка на основе соотношения видимой части к общей.
         * Как только добавляется новый элемент в список, ширина контейнера увеличивается.
         */
        const updateScrollThumb = () => {
            const scrollWidth = scrollContainer.scrollWidth
            const clientWidth = scrollContainer.clientWidth
            const ratio = clientWidth / scrollWidth
            setScrollThumbWidth(clientWidth * ratio)
        }

        /**
         * Слушаем изменение размера окна и обновляем ползунок
         */
        window.addEventListener('resize', updateScrollThumb)
        updateScrollThumb()

        return () => {
            window.removeEventListener('resize', updateScrollThumb)
        };
    }, [
        filesListLength
    ])

    const handleScroll = useCallback(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth
        const scrollLeft = scrollContainer.scrollLeft

        const thumbLeft = (scrollLeft / maxScrollLeft) * (scrollContainer.clientWidth - scrollThumbWidth)

        setScrollPosition(thumbLeft)
    }, [scrollThumbWidth])

    const startDragging = useCallback((e: React.MouseEvent) => {
        setIsDragging(true)
        e.preventDefault()
    }, [])

    const stopDragging = useCallback(() => {
        setIsDragging(false)
    }, [])

    /**
     * Функция, которая срабатывает когда пользователь нажимает на скролл и двигает его в разных направлениях
     * @param e
     */
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current || !scrollThumbRef.current) return

        const scrollContainer = scrollContainerRef.current

        /**
         * Определяем перемещение ползунка скролла
         * scrollContainer.scrollWidth - вся ширина контейнера без обрезки
         * scrollThumb.clientWidth - ширина видимой зоны контейнера с файлами. Ширина взята из ссылки на
         */
        const moveRatio = scrollContainer.scrollWidth / scrollContainer.clientWidth

        /**
         * На сколько нужно передвинуть ползунок
         */
        const newScrollPosition = e.movementX * moveRatio

        scrollContainer.scrollLeft += newScrollPosition
    }, [isDragging])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', stopDragging)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', stopDragging)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', stopDragging)
        };
    }, [
        handleMouseMove,
        stopDragging,
        isDragging
    ]);

    const arrowMoveLeft = useCallback(() => {

    }, [])

    const arrowMoveRight = useCallback(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        const moveRatio = scrollContainer.scrollWidth / scrollContainer.clientWidth
        const newScrollPosition = arrowMoveStep * moveRatio

        scrollContainer.scrollLeft += newScrollPosition
    }, [])

    return filesListLength ? (
        <div className={styles.filesListWrapper}>
            <div onClick={arrowMoveLeft}>
                <ArrowForList
                    activeStatus={!!scrollPosition}
                    className={styles.arrowForListLeft}/>
            </div>

            <div className={styles.filesListAndScroll}>
                <div ref={scrollContainerRef}
                     onScroll={handleScroll}
                     className={styles.filesList}
                     style={{
                         gridTemplateColumns: filesListLength ? `repeat(${filesListLength}, 5rem)` : "1fr",
                         overflowX: filesListLength ? "auto" : "hidden"
                     }}>
                    {currentFilesList.files.map((file, i) => (
                        <div key={`key=${i}`} className={styles.fileWrapper}>
                            <FilePreview file={file}
                                         removeHandler={removeFile}
                                         changeFile={changeFile}/>

                        </div>
                    ))}
                </div>

                {filesListLength > 3 && (
                    <div className={styles.horizontalScrollWrapper}>
                        <div ref={scrollThumbRef}
                             className={styles.horizontalScroll}
                             onMouseDown={startDragging}
                             style={{
                                 width: `${scrollThumbWidth}px`,
                                 left: `${scrollPosition}px`
                             }}></div>
                    </div>
                )}
            </div>

            <div onClick={arrowMoveRight}>
                <ArrowForList activeStatus={endOfList}
                              className={styles.arrowForListRight}/>
            </div>
        </div>
    ) : (
        <div className={styles.filesListEmptyWrapper}>
            <div className={styles.emptyFileList}>
                <div className={styles.emptyListMessage}>
                    <ButtonText>{placeholder}</ButtonText>
                </div>
            </div>
        </div>
    );
};

export default HorizontalScroll;