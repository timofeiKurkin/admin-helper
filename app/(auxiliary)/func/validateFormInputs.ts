import { PermissionsOfFormType, UserTextDataType } from "../types/AppTypes/ContextTypes";
import { CompanyInputDataType, requiredFields, ValidateKeysType } from "../types/AppTypes/InputHooksTypes";
import { CompanyInputType, InputHelpfulItemType } from "../types/Data/Interface/RootPage/RootPageContentType";
import rootData from "@/data/interface/root-page/companies.json"

interface ValidateFormInputsResponse {
    keys: ValidateKeysType[];
    status: boolean;
}

/**
 * Function for checking all inputs for validate status. Return "true" if all of inputs good and "false" otherwise
 * @param data - text data for validation
 * @param permissionsOfForm - permissions for processing personal data
 * @returns ValidateFormInputsResponse
 */
export const validateFormInputs = (
    data: UserTextDataType,
    permissionsOfForm: PermissionsOfFormType
): ValidateFormInputsResponse => {
    const rejectionInputs: ValidateKeysType[] = []

    for (const key of requiredFields) {
        if (!data[key].validationStatus) {
            rejectionInputs.push(key)
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
    const companies = rootData as InputHelpfulItemType[]
    if (type === "choose") {
        return !!companies.find((comp) => comp.title === company)
    }

    return true
}