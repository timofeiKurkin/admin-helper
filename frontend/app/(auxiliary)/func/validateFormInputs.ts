import {PermissionsOfFormType, UserTextDataType, VoiceMessageFileType} from "../types/AppTypes/ContextTypes";
import {
    CompanyInputDataType,
    MessageInputDataType,
    requiredFields,
    ValidateKeysType
} from "../types/AppTypes/InputHooksTypes";
import {InputHelpfulItemType} from "../types/Data/Interface/RootPage/RootPageContentType";
import rootData from "@/data/interface/root-page/companies.json"

interface ValidateFormInputsResponse {
    keys: ValidateKeysType[];
    status: boolean;
}

/**
 * Function for checking all inputs for validate status. Return "true" if all of inputs good and "false" otherwise
 * @param textData - text data for validation
 * @param messageFile - file data for validation
 * @param permissionsOfForm - permissions for processing personal data
 * @param messageType - type of message
 * @returns ValidateFormInputsResponse
 */
export const validateFormInputs = (
    textData: UserTextDataType,
    messageFile: VoiceMessageFileType,
    permissionsOfForm: PermissionsOfFormType,
    messageType: MessageInputDataType
): ValidateFormInputsResponse => {
    const rejectionInputs: ValidateKeysType[] = []

    for (const key of requiredFields) {
        if (key === "message" && messageType === "file") {
            if (!validateFileMessage(messageFile)) {
                rejectionInputs.push(key)
            }
        } else {
            if (!textData[key].validationStatus) {
                rejectionInputs.push(key)
            }
        }
    }

    if (!permissionsOfForm.userAgreedPolitical) {
        rejectionInputs.push("user_political")
    }

    return {
        keys: rejectionInputs,
        status: !rejectionInputs.length
    }

    // check all required inputs
    // get notification to the user, if some inputs invalid
}


export const validateCompanyData = (company: string, type: CompanyInputDataType): boolean => {
    const companies = rootData satisfies InputHelpfulItemType[]
    if (type === "choose") {
        return !!companies.find((comp) => comp.title === company)
    }

    return true
}


export const validateFileMessage = (messageFile: VoiceMessageFileType): boolean => {
    return messageFile.validationStatus
}