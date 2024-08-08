import {FormDataItemType, ProviderStateType, UserTextDataType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {Dispatch, SetStateAction} from "react";

export const updateFormsDataState = <T>(args: {
    setAppState: Dispatch<SetStateAction<ProviderStateType>>
    newValue: FormDataItemType<T>;
    key: string;
}) => {
    args.setAppState((prevState) => {
        const updatedTextData: UserTextDataType = {
            ...prevState.userDataFromForm?.textData,
            [args.key]: args.newValue
        }

        if (JSON.stringify(updatedTextData) === JSON.stringify(prevState.userDataFromForm?.textData)) {
            return prevState
        }

        return {
            ...prevState,
            userDataFromForm: {
                ...prevState.userDataFromForm,
                textData: updatedTextData
            }
        }
    })
}