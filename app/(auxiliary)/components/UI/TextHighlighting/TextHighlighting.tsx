import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {blue_dark} from "@/styles/colors";


interface PropsType extends ChildrenType {
    wordIndexes: [number, number];
    fontWeight?: number;
    highlightColor?: string;
    link?: string;
}

const TextHighlighting: FC<PropsType> = ({
                                             children,
                                             highlightColor = blue_dark,
                                             fontWeight = 500,
                                             wordIndexes,
                                             link = ""
                                         }) => {
    const highlightContent = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.props.children) {
            const updatedChildren = React.Children.map(
                child.props.children,
                (currentChild: React.ReactNode | string) => {
                    if (typeof currentChild === "string") {
                        const wordsArray: string[] = currentChild.split(" ")
                        const currentPhrase = wordsArray.slice(...wordIndexes).join(" ")
                        const filteredWords = wordsArray
                            .filter((_, i) => !(i < wordIndexes[0] && i > wordIndexes[1]))

                        return [
                            filteredWords.slice(0, wordIndexes[0]).join(" "),
                            " ",
                            <span key={`key-${currentPhrase}`} style={{
                                color: highlightColor,
                                fontWeight: fontWeight,
                            }}>
                                <a href={link} target={"_blank"}>{currentPhrase}</a>
                            </span>,
                            " ",
                            filteredWords.slice(wordIndexes[1]).join(" ")
                        ]
                    }

                    return currentChild
                })

            return React.cloneElement(child, {...child.props, children: updatedChildren})
        }

        return child
    }

    return React.Children.map(children, highlightContent)
};

export default TextHighlighting;