import { searchHandler } from '@/app/(auxiliary)/func/searchHandler';
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import { InputHelpfulItemType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { FC, useEffect, useState } from 'react';
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
};

export default InputWithDataList;