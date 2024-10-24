import React, { FC } from 'react'
import inputStyles from "../Input/Input.module.scss";
import borderStyles from "../Input/InputBorder.module.scss";
import fontStyles from "@/styles/fonts.module.scss";

const InputSkeleton: FC = () => {
  return (
    <div className={inputStyles.inputWrapper} style={{width: "100%", height:"100%"}}>
        {/* <div className={inputStyles.inputBox}>
            <input
                className={`${fontStyles.buttonText} ${inputStyles.inputStyle} ${inputStyles.inputInactive}`}
            />
        </div> */}
        <div className={inputStyles.borderBox}>
            <span className={borderStyles.inputBorderAnimation}></span>
        </div>
    </div>
  )
}

export default InputSkeleton