import {PagedPlaylist, SimplePlaylist} from "../../models/playlist";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchUserPlaylists} from "../../service/playlist.http";
import {Track} from "../../models/track";

export interface PlaylistState {
    cache: Record<number, PagedPlaylist>;
    playlists: SimplePlaylist[];
    loaded: boolean;
    loading: boolean;
}

const initialState: PlaylistState = {
    cache: {},
    playlists: [],
    loaded: false,
    loading: false
}

export const fetchPlaylists = createAsyncThunk(
    'playlists/fetch_all',
    () => fetchUserPlaylists()
);


export const playlistSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        addTrack: (state, action: PayloadAction<{ playlistId: number, track: Track }>) => {
            const playlist = state.cache[action.payload.playlistId];
            if (playlist.tracks.length === playlist.totalSize) {
                playlist.totalSize++;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchPlaylists.fulfilled, (state, action) => {
            state.cache = action.payload.reduce((acc, x) => ({
                ...acc,
                [x.id]: x
            }), {});
            state.playlists = action.payload;
            state.loaded = true;
            state.loading = false;
        });

        builder.addCase(fetchPlaylists.pending, state => {
            state.loading = true;
        })
    }
})
