import React, {FC, ReactNode, useEffect, useState} from 'react';
import styles from "./InputWithDataList.module.scss"
import {InputHelpfulItemType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import Fuse from "fuse.js";


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


interface PropsType {
    value: string;
    dataList?: {
        listType: string;
        list: InputHelpfulItemType[];
    };
    inputIsDirty: boolean;
    children: ReactNode;
}

const InputWithDataList: FC<PropsType> = ({
                                              value,
                                              dataList,
                                              inputIsDirty,
                                              children,
                                          }) => {

    const [currentHelpfulList, setCurrentHelpfulList] = useState<string[]>([])

    useEffect(() => {
        if (value.length >= 3 && dataList) {
            const searchResult = searchHandler(dataList.list, value)
            const foundedItems = searchResult.map((res) => res.item.title)

            if(!foundedItems.includes(value)) {
                setCurrentHelpfulList(foundedItems)
            }
        }

        if (!value.length) {
            setCurrentHelpfulList([])
        }
    }, [
        inputIsDirty,
        value,
        dataList
    ]);

    const chooseHelpfulItem = (item: string) => {
        setCurrentHelpfulList([])

        React.Children.map(children, element => {
            if (!React.isValidElement(element)) return

            element.props.children.props.onChange({target: {value: item}})
            return element
        })
    }

    return (
        <div className={styles.inputWrapper}>
            {children}

            {
                (currentHelpfulList.length) ? (
                    <div className={styles.helpfulList}>
                        {currentHelpfulList.map((item, index) => (
                            <span key={`key=${index}`}
                                  className={styles.helpfulItem}
                                  onClick={() => chooseHelpfulItem(item)}>
                                {item}
                            </span>
                        ))}
                    </div>
                ) : null
            }
        </div>
    );
};

export default InputWithDataList;