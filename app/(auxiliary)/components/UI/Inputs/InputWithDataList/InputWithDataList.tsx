import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeCompanyInputDataType, selectCompanyInputDataType } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice';
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import { CompanyInputDataType, companyLocalData, companyLocalDataVariable } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';
import { InputHelpfulItemType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { FC, useEffect, useRef, useState } from 'react';
import Arrow from '../../SVG/Arrow/Arrow';
import Close from '../../SVG/Close/Close';
import Text from '../../TextTemplates/Text';
import styles from "./InputWithDataList.module.scss";
import { AnimatePresence, motion } from "framer-motion"
import { searchHandler } from '@/app/(auxiliary)/func/searchHandler';
import HelpfulList from './HelpfulList/HelpfulList';
import MultiValuableList from './MultiValuableList/MultiValuableList';



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

    const [currentHelpfulList, setCurrentHelpfulList] = useState<string[]>([])


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
        changeValueHandler(item)
    }


    if (type === "helpful") {
        return (
            <HelpfulList chooseHelpfulItem={chooseHelpfulItem}
                inputIsDirty={inputIsDirty}
                currentHelpfulList={currentHelpfulList}>
                {children}
            </HelpfulList>
        )
    } else {
        return (
            <MultiValuableList changeValueHandler={changeValueHandler}
                chooseHelpfulItem={chooseHelpfulItem}
                currentHelpfulList={currentHelpfulList}
                dataList={dataList}
                inputIsDirty={inputIsDirty}
                value={value}>
                {children}
            </MultiValuableList>
        )
    }


    // return (
    //     <div className={styles.inputWrapper}
    //         tabIndex={-1}
    //         onFocus={() => listVisibilityHandler()}
    //         onBlur={() => listVisibilityHandler()}
    //         ref={rootRef}
    //     >
    //         {type === "helpful" ? (

    //         ): (
    //                 null

    //                 // <MultiValuableList value={value}>
    //                 //     {children}
    //                 // </MultiValuableList>

    //                 // <>
    //                 //     {(isChosen) ? (
    //                 //         <div className={styles.removeSelected} onClick={clearValue}>
    //                 //             <Close className={styles.removeButton} />
    //                 //         </div>
    //                 //     ) : null}

    //                 //     {children}

    //                 //     {companyInputDataType === "choose" ? (
    //                 //         <>
    //                 //             {!isChosen ? (
    //                 //                 <ul className={styles.companyList}
    //                 //                     style={{ display: (listVisibility && value.length >= 3) ? "flex" : "none" }}>
    //                 //                     {companyInputDataType === "choose" && currentHelpfulList.length ? currentHelpfulList.map((item, index) => (
    //                 //                         <li key={`key=${index}`} className={styles.helpfulItem} onClick={() => chooseHelpfulItem(item)}>
    //                 //                             <Text>
    //                 //                                 {item}
    //                 //                             </Text>
    //                 //                         </li>
    //                 //                     )) : null}

    //                 //                     <li key={`key=${currentHelpfulList.length}`}
    //                 //                         onClick={() => changeInputTypeHandler("write")}
    //                 //                         className={`${styles.helpfulItem} ${styles.differentOrganization}`}>
    //                 //                         <Text>Другая организация</Text> <Arrow />
    //                 //                     </li>
    //                 //                 </ul>
    //                 //             ) : null}
    //                 //         </>
    //                 //     ) : (
    //                 //         <ul className={styles.companyList}
    //                 //             style={{ display: (listVisibility && value.length >= 3) ? "flex" : "none" }}>
    //                 //             <li key={`key=${currentHelpfulList.length}`}
    //                 //                 onClick={() => changeInputTypeHandler("choose")}
    //                 //                 className={`${styles.helpfulItem} ${styles.differentOrganization}`}>
    //                 //                 <Text>Найти в списке</Text> <Arrow />
    //                 //             </li>
    //                 //         </ul>
    //                 //     )}
    //                 // </>
    //             )}

    //     </div>
    // )
};

export default InputWithDataList;