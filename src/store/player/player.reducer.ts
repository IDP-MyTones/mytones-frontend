import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {range, shuffleArray} from "../../utils/array";
import Player from "./player";
import {Track} from "../../models/track";
import {store} from "../store";
import {getHttp} from "../../service/http";
import {Page, Pageable} from "../../utils/pagination";

export enum RepeatType {
    NONE, TRACK, PLAYLIST
}

export interface PlayerState {
    loading: boolean;
    paused: boolean;
    shuffled: boolean;
    queueOrder: number[];

    currentTrackIndex?: number;
    currentTrackTime?: number;
    currentTrackDuration?: number;

    currentTrack?: Track;

    repeatType: RepeatType;
}

const initialState: PlayerState = {
    loading: false,
    paused: true,
    shuffled: false,
    queueOrder: [],
    repeatType: RepeatType.NONE,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        shuffle: state => {
            if (state.queueOrder) {
                state.queueOrder = state.shuffled ? range(state.queueOrder.length) : shuffleArray(state.queueOrder);
            }

            state.shuffled = !state.shuffled;
        },
        init: (state, action: PayloadAction<{ queueSize: number }>) => {
            state.queueOrder = range(action.payload.queueSize);
            if (state.shuffled) {
                state.queueOrder = shuffleArray(state.queueOrder);
            }
            state.currentTrackTime = 0;
            state.currentTrackDuration = 0;
        },
        pause: state => {
            state.paused = true;
            Player.pause();
        },
        play: (state, action: PayloadAction<{ index?: number, time?: number } | undefined>) => {
            state.paused = false;
            state.currentTrackTime = action.payload?.time ?? state.currentTrackTime ?? 0;
            state.currentTrackIndex = action.payload?.index ?? state.currentTrackIndex ?? 0;

            if (state.currentTrack) {
              void Player.play(state.currentTrackTime);
            }
        },
        refresh: (state, action: PayloadAction<{ currentTime: number, duration: number }>) => {
            state.currentTrackDuration = action.payload.duration;
            state.currentTrackTime = action.payload.currentTime;
        },
        repeat: state => {
            switch (state.repeatType) {
                case RepeatType.NONE: state.repeatType = RepeatType.PLAYLIST; break;
                case RepeatType.PLAYLIST: state.repeatType = RepeatType.TRACK; break;
                default: state.repeatType = RepeatType.NONE;
            }
        },
        setTrack: (state, action: PayloadAction<{track: Track, queueOrderIndex?: number, queueIndex: number}>) => {
            state.currentTrack = action.payload.track;
            state.paused = false;
            state.currentTrackIndex = action.payload.queueOrderIndex || state.queueOrder.findIndex(x => x === action.payload.queueIndex);
            state.currentTrackTime = 0;
            state.currentTrackDuration = 0;
            state.loading = false;

            void Player.play(0, action.payload.track.url);
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase(fetchTrack.fulfilled, (state, action) => {
    //         state.paused = false;
    //         state.currentTrack = action.payload.track;
    //         state.currentTrackIndex = action.payload.queueOrderIndex || state.queueOrder.findIndex(x => x === action.payload.queueIndex);
    //         state.currentTrackTime = 0;
    //         state.currentTrackDuration = 0;
    //         state.loading = false;
    //
    //         void Player.play(0, action.payload.track.url);
    //     });
    //     builder.addCase(fetchTrack.pending, (state) => {
    //         state.loading = true;
    //     })
    // }
});

export const { shuffle, init, repeat, pause, play, refresh } = playerSlice.actions;

export default playerSlice.reducer;

// const fetchTrackBro = (queueIndex: number): Promise<Track> {
//     if (store.getState().queue.fetchedTracks.length >= queu)
// }

const fetchTrack = (queueIndex: number = 0): Promise<Track> => {
    const queue = store.getState().queue;

    if (queue.fetchedTracks.length > queueIndex) {
        return new Promise(resolve => resolve(queue.fetchedTracks[queueIndex]))
    }

    const pageable: Pageable = {
        size: 1,
        page: queueIndex
    }
    return getHttp<Page<Track>>(`/tracks/${queue.sourceType}/${queue.sourceId}`, pageable).then(x => x.content[0])
}

export const playTrackFacade = (queueIndex: number = 0, queueOrderIndex?: number) => {
    fetchTrack(queueIndex)
        .then(track => store.dispatch(playerSlice.actions.setTrack({track, queueIndex, queueOrderIndex})))
}
