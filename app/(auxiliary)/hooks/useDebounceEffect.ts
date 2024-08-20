import {useEffect, DependencyList} from "react";

interface HookProps {
    fn: () => void;
    waitTime: number;
    deps?: [];
}

export const useDebounceEffect = ({
                                      fn,
                                      waitTime,
                                      deps = []
}: HookProps) => {
    useEffect(() => {
        const time = setTimeout(() => {
            fn.apply(undefined, deps)
        }, waitTime)

        return () => {
            clearTimeout(time)
        }
    }, [deps, fn, waitTime]);
}
