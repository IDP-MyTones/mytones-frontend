import React, {useEffect, useState} from 'react';
import './App.scss';
import {Provider, useSelector} from "react-redux";
import {RootState, store} from "./store/store";
import {fetchQueuePage} from "./store/queue.reducer";
import {BaseLayout} from "./components/layouts/BaseLayout";
import {init} from "./store/player/player.reducer";
import {PlaylistPage} from "./pages/playlists/Playlist";
import {createBrowserRouter, Route, Router, RouterProvider, Routes} from "react-router-dom";
import {PlaylistsPage} from "./pages/playlists/Playlists";
import {FavoritesPage} from "./pages/favorites/Favorites";
import {ArtistsPage} from "./pages/artists/Artists";
import SignIn from "./pages/auth/SignInt";
import SignUp from "./pages/auth/SignUp";
import {UploadPage} from "./pages/upload/Upload";
import {AlbumPage} from "./pages/albums/Album";
import {AdminPanelPage} from "./pages/admin/AdminPanel";
import {ArtistPage} from "./pages/artists/Artist";
import {NewArtistsPage} from "./pages/artists/NewArtists";
import {Alert, Snackbar} from "@mui/material";
import snackReducer, {SnackState} from "./store/snack.reducer";
import {Snack} from "./components/snack/Snack";
import {ExplorePage} from "./pages/explore/Explore";


const router = createBrowserRouter([

    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: '/playlists',
                element: <PlaylistsPage />
            },
            {
                path: '/playlists/:id',
                element: <PlaylistPage />
            },
            {
                path: '/',
                element: <FavoritesPage />
            },
            {
                path: '/manage/artists',
                element: <NewArtistsPage />
            },
            {
                path: '/upload',
                element: <UploadPage />
            },
            {
                path: '/albums/:id',
                element: <AlbumPage />
            },
            {
                path: '/admin',
                element: <AdminPanelPage />
            },
            {
                path: '/artists/:id',
                element: <ArtistPage />
            },
            {
                path: '/explore',
                element: <ExplorePage />
            }
        ]
    },
    {
        path: '/login',
        element: <SignIn />
    },
    {
        path: '/register',
        element: <SignUp />
    }
])

function App() {

    return (
        <Provider store={store}>
            <RouterProvider router={router} />

            <Snack />
      </Provider>
  );
}


export default App;
