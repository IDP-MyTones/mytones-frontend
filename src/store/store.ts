import {configureStore} from "@reduxjs/toolkit";
import playerReducer from "./player/player.reducer";
import queueReducer from "./queue/queue.reducer";

export const store = configureStore({
    reducer: {
        player: playerReducer,
        queue: queueReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
