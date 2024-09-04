import {combineSlices, configureStore} from "@reduxjs/toolkit";
import {userFormDataSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {appSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {photoEditorSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";


const rootReducer = combineSlices(userFormDataSlice, appSlice, photoEditorSlice)
export type RootState = ReturnType<typeof rootReducer>

export const storeSetup = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware(
                {
                    serializableCheck: false
                        // {
                        //     ignoredPaths: [
                        //         "userFormDataSlice.file_data.photo.files",
                        //         "payload.data.value"
                        //     ]
                        // }
                }
            )
        },
    })
}

export type AppStore = ReturnType<typeof storeSetup>;
export type AppDispatch = AppStore["dispatch"];
// export type AppThunk<ThunkReturnType = void> = ThunkAction<
//     ThunkReturnType,
//     RootState,
//     unknown,
//     Action
// >;