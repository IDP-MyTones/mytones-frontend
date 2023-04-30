import { SimplePlaylist } from "../models/playlist";
import {Page, Pageable} from "../utils/pagination";
import {Track} from "../models/track";
import {data} from "../store/queue/queue.data";

export const fetchUserPlaylists = (): Promise<SimplePlaylist[]> => {
    return new Promise(resolve => resolve(playlists));
}

export const savePlaylist = (playlistName: string): Promise<SimplePlaylist> => {
    return new Promise(resolve => resolve({
        id: 1111,
        name: playlistName,
        imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/137625112577745.60177189ef503.png"
    }))
}

export const addTrackToPlaylist = (playlistId: number, trackId: number): Promise<void> => {
    return new Promise(resolve => resolve())
}

export const removeTrackFromPlaylist = (playlistId: number, trackId: number): Promise<void> => {
    return new Promise(resolve => resolve())
}

export const uploadPlaylistPicture = (playlistId: number, file: File): Promise<SimplePlaylist> => {
    return new Promise(resolve => resolve({
        id: 1111,
        name: "Testing",
        imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/137625112577745.60177189ef503.png"
    }))
}

export const fetchPlaylistTrackPage = (pageable: Pageable): Promise<Page<Track>> => {
    return new Promise(resolve => resolve({
        content: data.slice(pageable.offset, pageable.offset + pageable.size),
        number: pageable.page,
        size: pageable.size,
        totalPages: Math.ceil(data.length / pageable.size),
        totalElements: data.length
    }))
}

const playlists: SimplePlaylist[] = [
    {
        id: 1,
        name: "Training",
        imageUrl: "https://i.scdn.co/image/ab67706c0000da841d7456ace527bc04afc2e11e"
    },
    {
        id: 2,
        name: "Sleep",
        imageUrl: "https://www.audkit.com/wp-content/uploads/2021/02/spotify-sleep-playlist.jpg"
    },
    {
        id: 3,
        name: "Training",
        imageUrl: "data:image/jpeg;base64,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"
    },
    {
        id: 4,
        name: "Sleep",
        imageUrl: "https://www.audkit.com/wp-content/uploads/2021/02/spotify-sleep-playlist.jpg"
    },
    {
        id: 1,
        name: "Training",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/athlete-training-with-dumbbells-in-gym-screaming-royalty-free-image-722227993-1547756570.jpg"
    },
    {
        id: 2,
        name: "Sleep",
        imageUrl: "https://www.audkit.com/wp-content/uploads/2021/02/spotify-sleep-playlist.jpg"
    },
    {
        id: 3,
        name: "Training",
        imageUrl: "https://images.lifestyleasia.com/wp-content/uploads/sites/6/2021/03/03214019/alonso-reyes-0HlI76m4jxU-unsplash-1125x900.jpg"
    },
    {
        id: 4,
        name: "Sleep",
        imageUrl: "https://www.audkit.com/wp-content/uploads/2021/02/spotify-sleep-playlist.jpg"
    }
]
