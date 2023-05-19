import {configureStore} from "@reduxjs/toolkit";
import playerReducer from "./player/player.reducer";
import queueReducer from "./queue.reducer";
import userReducer from "./user.reducer";
import snackReducer from "./snack.reducer";

export const store = configureStore({
    reducer: {
        player: playerReducer,
        queue: queueReducer,
        user: userReducer,
        snack: snackReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
