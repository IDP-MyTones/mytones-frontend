import './Playlists.scss';
import {useEffect, useState} from "react";
import {Playlist, SimplePlaylist} from "../../models/playlist";
import {playPlaylistFacade} from "../../store/queue.reducer";
import {Link, useNavigate} from "react-router-dom";
import { Button } from '@mui/material';
import {getHttp, postHttp} from "../../service/http";


import NoImg from '../../assets/images/no-img.png';
import {store} from "../../store/store";
import {error, success} from "../../store/snack.reducer";


const PlaylistCard = ({ playlist }: {playlist: SimplePlaylist}) => {
    const playPlaylist = (e: any) => {
        e.preventDefault();
        playPlaylistFacade(playlist.id, 0);
    }

    return (
        <Link to={`/playlists/${playlist.id}`}>
            <div className='playlist-card-wrapper m-2'>
                <div className='playlist-card-img'>
                    <img src={playlist.imageUrl || NoImg}/>
                </div>
                <div className='playlist-card-info'>
                    <div className='title'>{playlist.name}</div>
                </div>

                <div className="play--btn" onClick={e => playPlaylist(e)}>
                    <i className="fa-solid fa-circle-play"></i>
                </div>
            </div>
        </Link>
    )
}

export const PlaylistsPage = () => {

    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<SimplePlaylist[]>([]);

    const createPlaylist = () => {
        postHttp<number>("/playlists", 'Untitled playlist')
            .then(id => navigate(`/playlists/${id}?edit=true`))
            .then(() => store.dispatch(success("Playlist created successfully")))
            .catch(() => store.dispatch(error("Error on creating playlist")))
    }

    useEffect(() => {
        getHttp<Playlist[]>(`/playlists/search`, {value: ''})
            .then(setPlaylists);
    }, [])

    return (
        <div className='playlists-container mx-2 h-full'>
            <div className="mb-2"><Button variant="contained" onClick={createPlaylist}>Create new playlist</Button></div>
            <div className='playlists-wrapper flex flex-wrap justify-between max-h-full overflow-y-scroll' style={{paddingBottom: '40px'}}>
                {playlists.filter(p => p.name !== '__USER__FAVORITES__').map(p =>
                    <PlaylistCard playlist={p} key={p.id} />
                )}
            </div>
        </div>

    )
}
