import React, {useEffect, useState} from 'react';
import {
    ColumnDef,
    Row,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    playAlbumFacade,
} from "../../store/queue.reducer";
import {Track} from "../../models/track";
import {nextPageable, Page, Pageable} from "../../utils/pagination";
import {Link, useParams} from "react-router-dom";
import {Playlist} from "../../models/playlist";
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import {PlayerState} from "../../store/player/player.reducer";
import {deleteHttp, getHttp, postHttp, simplePostHttp} from "../../service/http";
import {SimpleArtist} from "../../models/artist";
import {error, success} from "../../store/snack.reducer";

const columnHelper = createColumnHelper<Track>();

export const Artists = ({ artists }: { artists?: SimpleArtist[] }) => {
    if (!artists) {
        return <></>
    }
    return <>
        {
            artists
                .map(artist => <Link to={`/artists/${artist.id}`} key={artist.id} className="underline">{artist.name}</Link>)
                .reduce((acc, artist) => (acc.length ? [...acc, ', ', artist] : [artist]), [] as any[])
        }
    </>
}

const AudioDetails = ({ audio }: {audio: Track}) => (
    <div className="flex flex-col w-full details text-left">
        <div className="font-semibold">{audio.name}</div>
        <div className="text-xs"><Artists artists={audio.artists} /></div>
    </div>
);

const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const _columns = [
    columnHelper.display({
        id: 'index',
        cell: info => <div className="index">{info.row.index + 1}</div>
    }),
    columnHelper.display({
        id: 'details',
        cell: info => <AudioDetails audio={info.row.original}  />
    }),
    columnHelper.display({
        id: 'duration',
        cell: info => <div>{formatDuration(info.row.original.duration)}</div>
    }),
    columnHelper.display({
        id: 'actions',
        cell: info => {
            if (info.row.original.inFavorites) {
                return <div className="actions"><i className="fa-solid fa-heart"></i></div>
            } else {
                return <div className="actions"><i className="fa-sharp fa-regular fa-heart"></i></div>
            }
        }
    })
];

class Queue {

    fetchedContent: Track[] = [];
    pageable: Pageable;
    isFetching: boolean;
    isLoaded: boolean;
    state = 0;

    constructor() {
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
    }

    reset() {
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
        this.fetchedContent = []
        this.state++;
    }

    fetch(albumId: number): Promise<Page<Track> | null> {
        this.isFetching = true;
        const state = this.state;
        return getHttp<Page<Track>>(`/tracks/albums/${albumId}`, this.pageable).then(page => {
            if (state !== this.state) {
                return null;
            }
            this.pageable = nextPageable(this.pageable);
            this.fetchedContent = [...this.fetchedContent, ...page.content];
            this.isLoaded = this.fetchedContent.length >= page.totalElements;
            this.isFetching = false;
            return page;
        })
    }

}

export const AlbumPage = () => {

    const [tracks, setTracks] = useState<Track[]>([]);
    const [album, setAlbum] = useState<Playlist>();

    const { id } = useParams();

    const queue = new Queue();
    queue.reset()

    useEffect(() => {
        queue.reset();
        setTracks([])
        getHttp<Playlist>(`/albums/${id}`).then(setAlbum);

    }, [id])

    useEffect(() => {
        queue.reset();
        setTracks([])
    }, [])

    useEffect(() => {
        if (!queue.isFetching || !queue.isLoaded) {
            queue.fetch(+id!).then(() => setTracks(queue.fetchedContent))
        }
    }, [album])


    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const columns = React.useMemo<ColumnDef<Track>[]>(() => _columns, []);


    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget as HTMLElement;
        if (!queue.isFetching && !queue.isLoaded && scrollHeight - scrollTop - clientHeight < 1000) {
            queue.fetch(+id!).then(() => setTracks(queue.fetchedContent));
        }
    };

    const table = useReactTable({
        data: tracks,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()

    const startPlaylist = (trackIndex: number) => {
        playAlbumFacade(album!.id, trackIndex)
    }

    const updateTrack = (track: Track, index: number) => {
        const _tracks = [...tracks];
        _tracks[index] = track;
        queue.fetchedContent = _tracks;
        setTracks(_tracks);
    }

    return (
        <div className='flex flex-col max-h-full' style={{paddingBottom: "40px"}}>
            <div className='playlist-header'>
                <div className='playlist-header-img'>
                    <img src={album?.imageUrl}/>
                </div>
                <div className='playlist-header-info'>
                    <h2>{album?.name}</h2>
                    <p>
                        <Artists artists={album?.artists} />
                    </p>
                </div>
            </div>

            <div className='queue-container flex flex-wrap justify-between mx-2 max-h-full overflow-y-scroll pr-10 -mr-10'
                 onScroll={handleScroll}
                 ref={tableContainerRef}>
                <table>
                    <tbody>{
                        rows.map((row, index) => (<QueueItem updateTrack={(track: Track) => updateTrack(track, index)} row={row} key={row.id} handleClick={() => startPlaylist(row.index)} />))
                    }</tbody>
                </table>
            </div>
        </div>
    )
}


const QueueItem = ({ row, handleClick, updateTrack }: {row: Row<Track>, updateTrack: any, handleClick: any}) => {

    const playerState = useSelector<RootState>(root => root.player) as PlayerState;

    const onClickHandler = (e: React.MouseEvent, column: string, track: Track) => {
        if (column === 'actions') {

            if (track.inFavorites) {
                deleteHttp(`/playlists/favorites/${track.id}`)
                    .then(() => store.dispatch(success("Removed from liked songs")))
                    .catch(() => store.dispatch(error("Error on removing from liked songs")))
            } else {
                simplePostHttp(`/playlists/favorites/${track.id}`)
                    .then(() => store.dispatch(success("Added to liked songs")))
                    .catch(() => store.dispatch(error("Error on adding to liked songs")))
            }

            track.inFavorites = !track.inFavorites;
            updateTrack(track);
        } else {
            handleClick();
        }
    }

    return (
        <tr className={`queue-item ${playerState.currentTrack?.id === row.original.id ? 'active' : ''}`}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td className={`${cell.id} py-2`} key={cell.id} onClick={e => onClickHandler(e, cell.column.id, cell.row.original)}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </td>
                )
            })}
        </tr>
    );
}
