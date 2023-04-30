import {store} from "../store";
import {StreamableTrack} from "../../models/track";

// export const fetchAudio = (id: number): StreamableTrack => {
    // store.getState().player
// }


export const fetchStreamableTrack = (playlistId: number, offset: number): Promise<StreamableTrack> =>
    new Promise(resolve => resolve({
        id: 1,
        name: "Anyone",
        artists: [
            {
                id: 1,
                name: "Justin Bieber",
            }
        ],
        albumId: 1,
        duration: 255,
        imageUrl: "https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/52/bb/8f/52bb8fdf-c7ad-f027-8617-98da5415f7d8/cover.jpg/1200x1200bf-60.jpg",
        url: "sasati"
    }))
