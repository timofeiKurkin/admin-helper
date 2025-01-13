import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { changeCompanyInputDataType, selectCompanyInputDataType } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice'
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { CompanyInputDataType, companyLocalData, companyLocalDataVariable } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes'
import { InputHelpfulItemType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'
import { AnimatePresence, motion, Variants } from "framer-motion"
import { FC, useEffect, useRef, useState } from 'react'
import Arrow from '../../../SVG/Arrow/Arrow'
import Close from '../../../SVG/Close/Close'
import Text from '../../../TextTemplates/Text'
import styles from "../InputWithDataList.module.scss"


interface PropsType extends ChildrenProp {
    value: string;
    currentHelpfulList: string[];
    dataList: InputHelpfulItemType[];
    inputIsDirty: boolean;
    changeValueHandler: (newValue: string) => void;
    chooseHelpfulItem: (newItem: string) => void;
}


const MultiValuableList: FC<PropsType> = ({
    value,
    children,
    currentHelpfulList,
    dataList,
    inputIsDirty,
    changeValueHandler,
    chooseHelpfulItem
}) => {
    const rootRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const companyInputDataType = useAppSelector(selectCompanyInputDataType)

    const [isChosen, setIsChosen] = useState<boolean>(false)
    const [listVisibility, setListVisibility] = useState<boolean>(inputIsDirty)
    const listVisibilityHandler = (noUpdate?: boolean) => {
        setListVisibility((prevState) => !prevState)
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

    const clearValue = () => {
        setIsChosen(false)
        changeValueHandler("")
    }

    useEffect(() => {
        const candidate = dataList.find((item) => item.title === value)
        setIsChosen(!!candidate)
    }, [dataList, value])

    const chooseHelpfulItemHandler = (newItem: string) => {
        setIsChosen(true)
        chooseHelpfulItem(newItem)
    }

    const variants: Variants = {
        hidden: {
            opacity: 0, y: "-10%", transition: { when: "afterChildren" }
        },
        visible: {
            opacity: 1, y: 0, transition: { when: "beforeChildren" }
        },
    }

    return (
        <div className={styles.inputWrapper}
            tabIndex={-1}
            onFocus={() => listVisibilityHandler()}
            onBlur={() => listVisibilityHandler()}
            ref={rootRef}>
            {(isChosen) ? (
                <div className={styles.removeSelected} onClick={clearValue}>
                    <Close className={styles.removeButton} />
                </div>
            ) : null}

            {children}

            <AnimatePresence>
                {(companyInputDataType === "choose" && !isChosen && (listVisibility && value.length >= 3)) ? (
                    <motion.ul className={styles.companyList}
                        variants={variants}
                        initial={"hidden"}
                        animate={"visible"}
                        exit={"hidden"}>
                        {companyInputDataType === "choose" && currentHelpfulList.length ? currentHelpfulList.map((item, index) => (
                            <li key={`key=${index}`} className={styles.helpfulItem} onClick={() => chooseHelpfulItemHandler(item)}>
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
                    </motion.ul>
                ) : null}
            </AnimatePresence>


            <AnimatePresence>
                {(companyInputDataType === "write" && (listVisibility && value.length >= 3)) ? (
                    <motion.ul className={styles.companyList}
                        variants={variants}
                        initial={"hidden"}
                        animate={"visible"}
                        exit={"hidden"}>
                        <li key={`key=${currentHelpfulList.length}`}
                            onClick={() => changeInputTypeHandler("choose")}
                            className={`${styles.helpfulItem} ${styles.differentOrganization}`}>
                            <Text>Найти в списке</Text> <Arrow />
                        </li>
                    </motion.ul>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

export default MultiValuableList
