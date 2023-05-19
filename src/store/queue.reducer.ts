import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Track} from "../models/track";
import {nextPageable, Page, Pageable} from "../utils/pagination";
import {store} from "./store";
import {playerSlice, playTrackFacade} from "./player/player.reducer";
import {getHttp} from "../service/http";

export const QUEUE_PAGE_SIZE = 20;
const DEFAULT_PAGEABLE: Pageable = {
    size: QUEUE_PAGE_SIZE,
    page: 0
}

export interface QueueState {
    sourceType?: 'playlists' | 'albums';
    sourceId?: number;
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

export const fetchPage = (sourceType: string, sourceId: number, pageable: Pageable): Promise<Page<Track>> => {
    return getHttp<Page<Track>>(`/tracks/${sourceType}/${sourceId}`, pageable);
}

export const fetchQueuePage = createAsyncThunk(
    'queue/fetch_page',
    () => {
        const queue = store.getState().queue;
        return fetchPage(queue.sourceType!, queue.sourceId!, queue.pageable)
    }
);

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {
        changePlaylist: (state, action: PayloadAction<Pick<QueueState, 'sourceId' | 'sourceType'>>) => {
            state.totalTracks = 0;
            state.pageable = DEFAULT_PAGEABLE;
            state.sourceType = action.payload.sourceType;
            state.sourceId = action.payload.sourceId;
            state.fetchedTracks = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchQueuePage.pending, state => {
            state.isFetching = true;
        });
        builder.addCase(fetchQueuePage.fulfilled, (state, action) => {
            state.isFetching = false;
            if (action.payload.number === 0) {
                state.fetchedTracks = action.payload.content;
            } else {
                state.fetchedTracks = [...state.fetchedTracks, ...action.payload.content];
            }
            state.totalTracks = action.payload.totalElements
            state.pageable = {
                page: action.payload.number + 1,
                size: action.payload.size
            };
        });
    }
});

export const { changePlaylist } = queueSlice.actions

export default queueSlice.reducer;

export const playPlaylistFacade = (id: number, index: number) => {
    store.dispatch(queueSlice.actions.changePlaylist({sourceType: 'playlists', sourceId: id}));
    store.dispatch(fetchQueuePage())
        .then(({payload}: any) => {
            store.dispatch(playerSlice.actions.init({queueSize: payload.totalElements}))
        })
        .then(() => playTrackFacade(index))
}

export const playAlbumFacade = (id: number, index: number) => {
    store.dispatch(queueSlice.actions.changePlaylist({sourceType: 'albums', sourceId: id}));
    store.dispatch(fetchQueuePage())
        .then(({payload}: any) => {
            store.dispatch(playerSlice.actions.init({queueSize: payload.totalElements}))
        })
        .then(() => playTrackFacade(index))
}