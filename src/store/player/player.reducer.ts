import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {range, shuffleArray} from "../../utils/array";
import Player from "./player";
import {StreamableTrack, Track} from "../../models/track";
import {data, streamableData} from "../queue/queue.data";

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

    currentTrack?: StreamableTrack;

    repeatType: RepeatType;
}

const initialState: PlayerState = {
    loading: false,
    paused: true,
    shuffled: false,
    queueOrder: [],
    repeatType: RepeatType.NONE,
};

export const fetchTrack = createAsyncThunk(
    'player/fetch_track',
    (props: {queueIndex: number, queueOrderIndex?: number}) => _fetchTrack(props.queueIndex, props.queueOrderIndex)
);

const _fetchTrack = (queueIndex: number, queueOrderIndex?: number): Promise<{track: StreamableTrack, queueIndex: number, queueOrderIndex?: number}> => {
    return new Promise((resolve) => resolve({track: streamableData[queueIndex], queueIndex, queueOrderIndex}));
}

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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTrack.fulfilled, (state, action) => {
            state.paused = false;
            state.currentTrack = action.payload.track;
            console.log([...state.queueOrder], action.payload.queueIndex)
            state.currentTrackIndex = action.payload.queueOrderIndex || state.queueOrder.findIndex(x => x === action.payload.queueIndex);
            state.currentTrackTime = 0;
            state.currentTrackDuration = 0;
            state.loading = false;

            void Player.play(0, action.payload.track.url);
        });
        builder.addCase(fetchTrack.pending, (state) => {
            state.loading = true;
        })
    }
});

export const { shuffle, init, repeat, pause, play, refresh } = playerSlice.actions;

export default playerSlice.reducer;
