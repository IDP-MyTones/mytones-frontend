import {SimpleArtist} from "./artist";

export interface Track {
    id: number;
    name: string;
    imageUrl: string;
    artists: SimpleArtist[];
    albumId: number;
    duration: number;
    url: string;
    inFavorites: boolean;
}

export interface UploadedTrack {
    name: string;
    artists: SimpleArtist[];
    duration: number;
    url: string;
}
