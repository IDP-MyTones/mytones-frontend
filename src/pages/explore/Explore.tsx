import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {Artist} from "../../models/artist";
import {AlbumCard} from "../artists/Artist";
import {getHttp} from "../../service/http";
import NoImg from "../../assets/images/no-img.png";
import {Link} from "react-router-dom";

export const ExplorePage = () => {

    const [search, setSearch] = useState('');

    const [albums, setAlbums] = useState<any[]>([])
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        if (!search ) {
            setAlbums([]);
            setArtists([]);
            return;
        }
        getHttp<any>("/albums/search", {value: search})
            .then(a => setAlbums(a))

        getHttp<any>("/artists/search", {value: search})
            .then(a => setArtists(a))
    }, [search])

    return <div className="p-4 max-h-full overflow-y-scroll">
        <div className="explore-search mb-2 flex items-center font-bold">
            Search: <TextField value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {albums.length > 0 && <>
            <h2>Albums:</h2>
            <div className="explore-albums-wrapper flex items-center flex-wrap mb-2">
                {albums.map(album =>
                    <AlbumCard playlist={album} key={album.id} />
                )}
            </div>
        </>}
        {artists.length > 0 && <>
            <h2>Artists:</h2>
            <div className="explore-albums-wrapper flex items-center flex-wrap mb-2">
                {artists.map(artist => <ArtistCard artist={artist} key={artist.id}/>)}
            </div>
        </>}
    </div>
}


const ArtistCard = (props: any) => {
    const { artist } = props;

    return <Link to={`/artists/${artist.id}`}>
        <div className='w-64 m-2 hover:shadow p-2'>
            <div className='h-64 flex items-center justify-center playlist-card-img rounded-full overflow-hidden'>
                <img className="h-full w-auto" src={artist.imageUrl || NoImg}/>
            </div>
            <div className='playlist-card-info'>
                <div className='title'>{artist.name}</div>
            </div>
        </div>
    </Link>
}