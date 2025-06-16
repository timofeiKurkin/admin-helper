import {validateCompanyData, validateFormInputs} from "../validateFormInputs"
import companies from "@/data/interface/root-page/companies.json"
import {InputHelpfulItemType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";


describe('validateCompanyData', () => {
    test('returns true if company is in the list and type is "choose"', () => {
        const existCompany = (companies satisfies InputHelpfulItemType[])[0].title
        expect(validateCompanyData(existCompany, "choose")).toBe(true);
    });

    test('returns false if company is not in the list and type is "choose"', () => {
        expect(validateCompanyData("NotRealCompany", "choose")).toBe(false);
    });

    test('returns true for any input when type is "write"', () => {
        expect(validateCompanyData("AnyCompany", "write")).toBe(true);
        expect(validateCompanyData("", "write")).toBe(true);
    });
});


const mockTextData = {
    message: {validationStatus: true, value: "Hello"},
    name: {validationStatus: true, value: "John"},
    phone: {validationStatus: true, value: "1234567890"},
    company: {validationStatus: true, value: "TestCorp"},
    number_pc: {validationStatus: true, value: "1234567890"},
    device: {validationStatus: true, value: "Laptop"}
}

const mockMessageFile = {
    validationStatus: true,
    value: new File([""], "voice.mp3")
}

const mockPermissions = {
    userCanTalk: true,
    userAgreedPolitical: true
}

describe("validateFormInputs", () => {
    it("returns status true when all fields are valid and type is text", () => {
        const result = validateFormInputs(mockTextData, mockMessageFile, mockPermissions, "text")
        expect(result.status).toBe(true)
        expect(result.keys).toEqual([])
    })

    it("returns status true when file message is valid and type is file", () => {
        const result = validateFormInputs(mockTextData, mockMessageFile, mockPermissions, "file")
        expect(result.status).toBe(true)
        expect(result.keys).toEqual([])
    })

    it("returns status false when one text field is invalid", () => {
        const invalidTextData = {
            ...mockTextData,
            name: {validationStatus: false, value: ""}
        }
        const result = validateFormInputs(invalidTextData, mockMessageFile, mockPermissions, "text")
        expect(result.status).toBe(false)
        expect(result.keys).toContain("name")
    })

    it("returns status false when file message is invalid and type is file", () => {
        const invalidFile = {...mockMessageFile, validationStatus: false}
        const result = validateFormInputs(mockTextData, invalidFile, mockPermissions, "file")
        expect(result.status).toBe(false)
        expect(result.keys).toContain("message")
    })

    it("returns status false when user hasn't agreed to policy", () => {
        const invalidPermissions = {...mockPermissions, userAgreedPolitical: false}
        const result = validateFormInputs(mockTextData, mockMessageFile, invalidPermissions, "text")
        expect(result.status).toBe(false)
        expect(result.keys).toContain("user_political")
    })
})
