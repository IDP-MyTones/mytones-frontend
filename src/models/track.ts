import {SimpleArtist} from "./artist";

export interface Track {
    id: number;
    name: string;
    imageUrl: string;
    artists: SimpleArtist[];
    albumId: number;
    duration: number;
}

export interface StreamableTrack extends Track {
    url: string;
}
