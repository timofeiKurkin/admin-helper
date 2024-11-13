import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeCompanyInputDataType, selectCompanyInputDataType } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice';
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import { CompanyInputDataType, companyLocalData, companyLocalDataVariable } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';
import { InputHelpfulItemType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import Fuse from "fuse.js";
import { FC, useEffect, useRef, useState } from 'react';
import Arrow from '../../SVG/Arrow/Arrow';
import Close from '../../SVG/Close/Close';
import Text from '../../TextTemplates/Text';
import styles from "./InputWithDataList.module.scss";


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
    dataList: InputHelpfulItemType[];
    inputIsDirty: boolean;
    changeValueHandler: (newValue: string) => void;
    type?: "helpful" | "chooseOrWrite"
}

const InputWithDataList: FC<PropsType> = ({
    value,
    dataList,
    inputIsDirty,
    changeValueHandler,
    children,
    type = "helpful"
}) => {
    const dispatch = useAppDispatch()
    const companyInputDataType = useAppSelector(selectCompanyInputDataType)
    const rootRef = useRef<HTMLDivElement>(null)
    // const [] = useState()

    const [currentHelpfulList, setCurrentHelpfulList] = useState<string[]>([])
    const [listVisibility, setListVisibility] = useState<boolean>(inputIsDirty)
    const listVisibilityHandler = (noUpdate?: boolean) => {
        setListVisibility((prevState) => !prevState)
    }
    const [isChosen, setIsChosen] = useState<boolean>(false)

    // The effect which works when the user changes the input
    useEffect(() => {
        if (value.length >= 3 && dataList) {
            const searchResult = searchHandler(dataList, value)
            const foundedItems = searchResult.map((res) => res.item.title)

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
        setIsChosen(true)
        changeValueHandler(item)
    }


    useEffect(() => {
        if (type === "chooseOrWrite") {
            const candidate = dataList.find((item) => item.title === value)
            setIsChosen(!!candidate)
        }
    }, [dataList, value, type])

    const clearValue = () => {
        setIsChosen(false)
        changeValueHandler("")
    }

    const changeInputTypeHandler = (newType: CompanyInputDataType) => {
        let localStorageKey = "0"
        for (const key in companyLocalData) {
            if (companyLocalData[key] === newType) {
                localStorageKey = key
            }
        }

        localStorage.setItem(companyLocalDataVariable, localStorageKey)
        dispatch(changeCompanyInputDataType(newType))
        setIsChosen(false)

        if (newType === "write" && rootRef.current) {
            rootRef.current.blur()
        }
    }

    return (
        <div className={styles.inputWrapper}
            tabIndex={-1}
            onFocus={() => listVisibilityHandler()}
            onBlur={() => listVisibilityHandler()}
            ref={rootRef}
        >
            {type === "helpful" ? (
                <>
                    {children}

                    {
                        (currentHelpfulList.length) ? (
                            <ul className={styles.helpfulList}
                                style={{ display: listVisibility ? "flex" : "none" }}>
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
                </>
            ) : (
                <>
                    {(isChosen) ? (
                        <div className={styles.removeSelected} onClick={clearValue}>
                            <Close className={styles.removeButton} />
                        </div>
                    ) : null}

                    {children}

                    {companyInputDataType === "choose" ? (
                        <>
                            {!isChosen ? (
                                <ul className={styles.companyList}
                                    style={{ display: (listVisibility && value.length >= 3) ? "flex" : "none" }}>
                                    {companyInputDataType === "choose" && currentHelpfulList.length ? currentHelpfulList.map((item, index) => (
                                        <li key={`key=${index}`} className={styles.helpfulItem} onClick={() => chooseHelpfulItem(item)}>
                                            <Text>
                                                {item}
                                            </Text>
                                        </li>
                                    )) : null}

                                    <li key={`key=${currentHelpfulList.length}`}
                                        onClick={() => changeInputTypeHandler("write")}
                                        className={`${styles.helpfulItem} ${styles.differentOrganization}`}>
                                        <Text>Другая организация</Text> <Arrow />
                                    </li>
                                </ul>
                            ) : null}
                        </>
                    ) : (
                        <ul className={styles.companyList}
                            style={{ display: (listVisibility && value.length >= 3) ? "flex" : "none" }}>
                            <li key={`key=${currentHelpfulList.length}`}
                                onClick={() => changeInputTypeHandler("choose")}
                                className={`${styles.helpfulItem} ${styles.differentOrganization}`}>
                                <Text>Найти в списке</Text> <Arrow />
                            </li>
                        </ul>
                    )}
                </>
            )}

        </div>
    )
};

export default InputWithDataList;