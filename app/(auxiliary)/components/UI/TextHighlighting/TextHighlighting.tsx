import React, { CSSProperties, FC } from 'react';
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { blue_dark } from "@/styles/colors";


interface PropsType extends ChildrenProp {
    wordIndexes: [number, number];
    style?: CSSProperties;
    link?: string;
}

const TextHighlighting: FC<PropsType> = ({
    children,
    wordIndexes,
    style,
    link = ""
}) => {
    const highlightColor = blue_dark
    const fontWeight = 400

    const highlightContent = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.props.children) {
            const updatedChildren = React.Children.map(
                child.props.children,
                (currentChild: React.ReactNode | string) => {
                    if (typeof currentChild === "string") {
                        const wordsArray: string[] =
                            currentChild.split(" ")

                        const currentPhrase: string =
                            wordsArray.slice(...wordIndexes).join(" ")

                        const filteredWords: string[] =
                            wordsArray.filter((_, i) =>
                                !(i < wordIndexes[0] && i > wordIndexes[1])
                            )

                        return [
                            filteredWords.slice(0, wordIndexes[0]).join(" "),
                            " ",
                            <span key={`key-${currentPhrase}`} style={{
                                color: highlightColor,
                                fontWeight: fontWeight,
                                ...style
                            }}>
                                {link ? (
                                    <a href={link} target={"_blank"}>{currentPhrase}</a>
                                ) : (
                                    currentPhrase
                                )}
                            </span>,
                            filteredWords.length > wordIndexes[1] ? " " : "",
                            filteredWords.slice(wordIndexes[1]).join(" ")
                        ]
                    }

                    return currentChild
                })

            return React.cloneElement(child, { ...child.props, children: updatedChildren })
        }

        return child
    }

    return React.Children.map(children, highlightContent)
};

export default TextHighlighting;