import {useEffect, useState} from "react";
import {ValidationReturnDataType, ValidationsType} from "@/app/(auxiliary)/types/AppTypes/HooksTypes";


const UseValidation = (value: string, validations: ValidationsType): ValidationReturnDataType => {
	const [isEmpty, setEmpty] = useState(true)
	const [minLength, setMinLength] = useState(false)
	const [maxLength, setMaxLength] = useState(false)

	const [inputValid, setInputValid] = useState(false)

	const [isEmptyError, setEmptyError] = useState('')
	const [minLengthError, setMinLengthError] = useState('')
	const [maxLengthError, setMaxLengthError] = useState('')


	useEffect(() => {
		for (const validation in validations) {
			switch (validation) {
                case 'isEmpty':
                    if (value) {
                        setEmpty(false)
                        setEmptyError('')
                    } else {
                        setEmpty(true)
                        setEmptyError('Поле не может быть пустым')
                    }
                    break

                case 'minLength':
					if(validations[validation] > 0) {
						if (value.length < validations[validation]) {
							setMinLength(true)
							setMinLengthError(`Минимальная длина - ${validations[validation]}`)
						} else {
							setMinLength(false)
							setMinLengthError('')
						}
					} else {
						break
					}
					break

				case 'maxLength':
					if (value.length > validations[validation]) {
						setMaxLength(true)
						setMaxLengthError(`Максимальная длинна - ${validations[validation]}`)
					} else {
						setMaxLength(false)
						setMaxLengthError('')
					}
					break
			}
		}
	}, [value, validations])

	useEffect(() => {
		if (isEmpty || minLength || maxLength) { // и сюда
			setInputValid(false)
		} else {
			setInputValid(true)
		}
	}, [isEmpty, minLength, maxLength]) // все ошибки сюда

	return {
		isEmpty,
		minLength,
		maxLength,
		inputValid,

		minLengthError,
		maxLengthError,
		isEmptyError
	}
};

export default UseValidation;