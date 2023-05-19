import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Artist} from "../../models/artist";
import {getHttp} from "../../service/http";
import NoImg from "../../assets/images/no-img.png";
import {playAlbumFacade} from "../../store/queue.reducer";
import {Artists} from "../albums/Album";

interface FullArtist extends Artist {
    albums: {
        id: number
        name: string;
        artists: Artist[];
        imageUrl: string;
    }[];
}

export const ArtistPage = () => {

    const { id } = useParams() as { id: string };
    const [artist, setArtist] = useState<FullArtist>();

    useEffect(() => {
        getHttp<FullArtist>(`/artists/${id}`)
            .then(setArtist)
    }, [id])

    return <div className='flex flex-col max-h-full overflow-y-scroll overflow-x-hidden' style={{paddingBottom: "40px"}}>
        <div className='playlist-header'>
            <div className='playlist-header-img relative'>
                <img src={artist?.imageUrl || NoImg} />
            </div>
            <div className='playlist-header-info'>
                <h2>{artist?.name} </h2>
            </div>
        </div>

        <div className='playlists-wrapper flex flex-wrap justify-between max-h-full' style={{paddingBottom: '40px'}}>
            {artist?.albums.map(p =>
                <AlbumCard playlist={p} key={p.id} />
            )}
        </div>


        <div className='artist-profile-footer text-sm p-4 mx-4 shadow'>
            <h3 className="text-sm">Description:</h3>
            <p>{artist?.description}</p>
        </div>
    </div>

}

export const AlbumCard = ({ playlist }: {playlist: any}) => {
    const playPlaylist = (e: any) => {
        e.preventDefault();
        playAlbumFacade(playlist.id, 0);
    }

    return (
        <div className="relative album-card-wrapper mb-3" style={{paddingBottom: "15px"}}>
            <Link to={`/albums/${playlist.id}`}>
                <div className=' m-2'>
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
            <div className="absolute text-xs bottom-2.5 z-50 left-4">
                <Artists artists={playlist.artists} />
            </div>
        </div>

    )
}