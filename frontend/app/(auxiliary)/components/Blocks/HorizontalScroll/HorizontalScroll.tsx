import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from "./HorizontalScroll.module.scss";
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';

interface PropsType {
    filesListLength: number;
    children: React.ReactNode
}

const HorizontalScroll: FC<PropsType> = ({
    filesListLength,
    children
}) => {
    const userDevice = useAppSelector(selectUserDevice)

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
    // const [endOfList, setEndOfList] = useState<boolean>(true)

    // const arrowMoveStep = 70

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

    return (
        <div className={`${styles.filesListWrapper} ${(filesListLength > 3 && !userDevice.phoneAdaptive) && styles.filesListWrapperWithScroll}`}>
            {/* <div className={styles.listArrowItem}>
                <ArrowForList
                   activeStatus={!!scrollPosition}
                 className={styles.arrowForListLeft}/>
            </div> */}

            <div className={`${styles.filesListWithoutScroll} ${(filesListLength > 3 && !userDevice.phoneAdaptive) && styles.filesListAndScroll}`}>
                <div ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={styles.filesList}
                    style={{
                        gridTemplateColumns: filesListLength ? `repeat(${filesListLength}, 5rem)` : "1fr",
                        // overflowX: filesListLength ? "auto" : "hidden"
                    }}>
                    {children}
                </div>

                {(filesListLength > 3 && !userDevice.phoneAdaptive) && (
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

            {/* <div className={styles.listArrowItem}>
                <ArrowForList activeStatus={endOfList}
                             className={styles.arrowForListRight}/>
            </div> */}
        </div>
    )
};

export default HorizontalScroll;