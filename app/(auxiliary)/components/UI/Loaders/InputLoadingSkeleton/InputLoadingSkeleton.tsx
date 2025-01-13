import { FC } from 'react';
import inputStyles from "../../Inputs/Input/Input.module.scss"
import borderStyles from "../../Inputs/Input/InputBorder.module.scss";

const InputLoadingSkeleton: FC = () => {
  return (
    <div className={inputStyles.inputWrapper} style={{ width: "100%", height: "100%" }}>
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

export default InputLoadingSkeleton