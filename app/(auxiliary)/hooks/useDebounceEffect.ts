import {useEffect, DependencyList} from "react";
import {PixelCrop} from "react-image-crop";

interface HookProps {
    fn: () => void;
    waitTime: number;
    deps: [PixelCrop, number, number];
}

export const useDebounceEffect = ({
                                      fn,
                                      waitTime,
                                      deps
}: HookProps) => {
    useEffect(() => {
        const time = setTimeout(() => {
            fn.apply(undefined, deps as any)
        }, waitTime)

        return () => {
            clearTimeout(time)
        }
    }, [deps, fn, waitTime]);
}
