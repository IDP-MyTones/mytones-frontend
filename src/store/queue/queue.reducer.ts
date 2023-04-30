import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Playlist} from "../../models/playlist";
import {Track} from "../../models/track";
import {nextPageable, Page, Pageable} from "../../utils/pagination";
import {store} from "../store";
import {data} from "./queue.data";

export const QUEUE_PAGE_SIZE = 20;
const DEFAULT_PAGEABLE: Pageable = {
    size: QUEUE_PAGE_SIZE,
    page: 0,
    offset: 0
}

export interface QueueState {
    playlist?: Playlist;
    totalTracks?: number;
    fetchedTracks: Track[];
    pageable: Pageable;
    isFetching: boolean;
}

const initialState: QueueState = {
    fetchedTracks: [],
    pageable: DEFAULT_PAGEABLE,
    isFetching: false,
};

export const fetchPage = (pageable: Pageable): Promise<Page<Track>> => {
    const content = data.slice(pageable.offset, pageable.offset + pageable.size);

    return new Promise((resolve) => resolve({
        content: content,
        number: pageable.page,
        size: pageable.size,
        totalPages: Math.ceil(data.length / pageable.size),
        totalElements: data.length
    }));
}

export const fetchQueuePage = createAsyncThunk(
    'queue/fetch_page',
    () => fetchPage(store.getState().queue.pageable)
);

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {
        changePlaylist: (state, action: PayloadAction<Playlist>) => {
            state.totalTracks = 0;
            state.pageable = DEFAULT_PAGEABLE;
            state.playlist = action.payload;
            state.fetchedTracks = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchQueuePage.pending, state => {
            state.isFetching = true;
        });
        builder.addCase(fetchQueuePage.fulfilled, (state, action) => {
            state.isFetching = false;
            state.fetchedTracks = [...state.fetchedTracks, ...action.payload.content];
            state.totalTracks = action.payload.totalElements
            state.pageable = nextPageable(state.pageable);
        })
    }
});

export const { changePlaylist } = queueSlice.actions

export default queueSlice.reducer;
