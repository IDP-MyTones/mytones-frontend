import {SimpleArtist} from "./artist";
import {Track} from "./track";

export interface SimplePlaylist {
    id: number;
    name: string;
    imageUrl: string;
}

export interface Playlist extends SimplePlaylist {
    artists: SimpleArtist[];
}

export interface PagedPlaylist extends SimplePlaylist {
    tracks: Track[];
    totalSize: number;
}
