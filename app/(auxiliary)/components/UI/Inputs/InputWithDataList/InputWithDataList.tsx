import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from "./InputWithDataList.module.scss"
import { InputHelpfulItemType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import Fuse from "fuse.js";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import Text from '../../TextTemplates/Text';


const searchHandler = (
    helpfulList: InputHelpfulItemType[],
    userValue: string
) => {
    const fuseOptions = {
        keys: [
            "keys"
        ],
        minMatchCharLength: 3,
        findAllMatches: false,
        threshold: 0.2,
        useExtendedSearch: false,
        includeMatches: true,

        ignoreLocation: true
    }

    return new Fuse(helpfulList, fuseOptions).search(userValue)
}


interface PropsType extends ChildrenProp {
    value: string;
    dataList?: InputHelpfulItemType[];
    inputIsDirty: boolean;
    changeValueHandler: (newValue: string) => void
}

const InputWithDataList: FC<PropsType> = ({
    value,
    dataList,
    inputIsDirty,
    changeValueHandler,
    children,
}) => {
    const helpfulListRef = useRef<HTMLUListElement>(null)
    const [currentHelpfulList, setCurrentHelpfulList] = useState<string[]>([])
    const [listVisibility, setListVisibility] = useState<boolean>(inputIsDirty)

    useEffect(() => {
        if (value.length >= 2 && dataList) {
            const searchResult = searchHandler(dataList, value)
            const foundedItems = searchResult.map((res) => res.item.title)

            // setCurrentHelpfulList(foundedItems)
            if (!foundedItems.includes(value)) {
                setCurrentHelpfulList(foundedItems)
            } else {
                setCurrentHelpfulList([])
            }
        }

        if (!value.length) {
            setCurrentHelpfulList([])
        }
    }, [
        value,
        dataList
    ]);

    const chooseHelpfulItem = (item: string) => {
        changeValueHandler(item)

        // if (helpfulListRef.current) {
        //     helpfulListRef.current.style.display = "none"
        // }

        // setCurrentHelpfulList([])
        // React.Children.map(children, element => {
        //     if (!React.isValidElement(element)) return

        //     element.props.children.props.onChange({ target: { value: item } })
        //     return element
        // })
    }

    // useEffect(() => {
    //     if (helpfulListRef.current && !currentHelpfulList.includes(value)) {
    //         helpfulListRef.current.style.display = "flex"
    //     }
    // }, [currentHelpfulList, value])

    useEffect(() => {
        const timer = setTimeout(() => {
            setListVisibility(inputIsDirty)
        }, 90)

        return () => {
            clearTimeout(timer)
        }
    }, [inputIsDirty])

    return (
        <div className={styles.inputWrapper}>
            {children}

            {
                (currentHelpfulList.length) ? (
                    <ul ref={helpfulListRef} style={{ display: listVisibility ? "flex" : "none" }} className={styles.helpfulList}>
                        {currentHelpfulList.map((item, index) => (
                            <li key={`key=${index}`} className={styles.helpfulItem} onClick={() => chooseHelpfulItem(item)}>
                                <Text>
                                    {item}
                                </Text>
                            </li>
                        ))}
                    </ul>
                ) : null
            }
        </div>
    );
};

export default InputWithDataList;