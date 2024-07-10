import React from "react";

export interface AppContextType {
    appState: StateType;
    setAppState: React.Dispatch<React.SetStateAction<StateType>>;
}

export interface StateType {
    userDevice: {
        phoneAdaptive: boolean;
        padAdaptive: boolean;
        desktopAdaptive: boolean;
    }
}