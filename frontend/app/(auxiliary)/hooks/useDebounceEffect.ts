import {useEffect} from "react";

interface HookProps {
    fn: () => void;
    waitTime: number;
    // deps: [PixelCrop, number, number];
    deps: any[];
}

export const useDebounceEffect = ({
                                      fn,
                                      waitTime,
                                      deps
}: HookProps) => {
    useEffect(() => {
        const time = setTimeout(() => {
             fn.apply(undefined, deps as [])
        }, waitTime)

        return () => {
            clearTimeout(time)
        }
    }, [deps, fn, waitTime]);
}
