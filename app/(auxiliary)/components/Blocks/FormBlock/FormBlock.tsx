"use client"

import React, {FC, useEffect, useState} from 'react';
import {AllTypesOfInputsArray} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import PartOfForm from "@/app/(auxiliary)/components/Blocks/FormBlock/PartOfForm/PartOfForm";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";


interface PropsType {
    inputContent: AllTypesOfInputsArray;
    formPartNumber: number;
}

const FormBlock: FC<PropsType> = ({
                                      inputContent,
                                      formPartNumber
                                  }) => {
    const userDevice = useAppSelector(selectUserDevice)
    const [inputCouples, setInputCouples] = useState<{
        first: AllTypesOfInputsArray,
        second: AllTypesOfInputsArray
    }>({
        first: inputContent.slice(0, 2),
        second: inputContent.slice(2, 5)
    })

    useEffect(() => {

        if (userDevice.desktopAdaptive) {
            setInputCouples({
                first: inputContent.slice(0, 2),
                second: inputContent.slice(2, 5)
            })
        }

        if (!formPartNumber) {
            if (userDevice.padAdaptive) {
                setInputCouples({
                    first: [inputContent[0], inputContent[2]],
                    second: [inputContent[1], inputContent[3]]
                })
            }
        } else {
            if (userDevice.phoneAdaptive) {
                setInputCouples({
                    first: [inputContent[0], inputContent[2]],
                    second: [inputContent[1], inputContent[3]]
                })
            }
        }

    }, [
        userDevice.padAdaptive,
        userDevice.phoneAdaptive,
        userDevice.desktopAdaptive,
        formPartNumber,
        inputContent
    ])

    return <PartOfForm formPartNumber={formPartNumber}
                       partOfInputsOne={inputCouples.first}
                       partOfInputsTwo={inputCouples.second}/>;
};

export default FormBlock;