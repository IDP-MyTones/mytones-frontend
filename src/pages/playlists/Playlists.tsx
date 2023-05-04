import './Playlists.scss';
import {ReactNode, useState} from "react";
import {SimplePlaylist} from "../../models/playlist";
import {range} from "../../utils/array";
import {store} from "../../store/store";
import {changePlaylist} from "../../store/queue/queue.reducer";
import {data} from "../../store/queue/queue.data";
import {play} from "../../store/player/player.reducer";


const PlaylistCard = () => {

    const playPlaylist = (e: any) => {
        store.dispatch(changePlaylist(data[0]));
        store.dispatch(play({ index: 0, time: 0 }));
        e.preventDefault();
    }

    return (
        <a href="/">
            <div className='playlist-card-wrapper m-2'>
                <div className='playlist-card-img'>
                    <img src="https://images.genius.com/1438f6ec31261424b341c07bd389d38d.1000x1000x1.jpg"/>
                </div>
                <div className='playlist-card-info'>
                    <div className='title'>Afterglow</div>
                    <div className='artists'><a href="/artists" className="underline">Ed Sheeran</a></div>
                </div>

                <div className="play--btn" onClick={e => playPlaylist(e)}>
                    <i className="fa-solid fa-circle-play"></i>
                </div>
            </div>
        </a>
    )
}

export const PlaylistsPage = () => {

    const [playlists, setPlaylists] = useState<SimplePlaylist[]>();

    const cards = range(100).map(p => <PlaylistCard key={p} />) || [];

    return (
        <div className='playlists-wrapper flex flex-wrap justify-between mx-2 max-h-full overflow-scroll'>
            {cards}
        </div>
    )
}
