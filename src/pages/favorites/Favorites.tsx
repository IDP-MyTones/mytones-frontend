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
    fetchPage,
    playPlaylistFacade
} from "../../store/queue.reducer";
import {Track} from "../../models/track";
import {nextPageable, Page, Pageable} from "../../utils/pagination";
import {Playlist} from "../../models/playlist";
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import {PlayerState} from "../../store/player/player.reducer";
import {deleteHttp, getHttp, simplePostHttp} from "../../service/http";
import {Artists} from "../albums/Album";
import {error, success} from "../../store/snack.reducer";

const columnHelper = createColumnHelper<Track>();

const AudioDetails = ({ audio }: {audio: Track}) => (
    <div className="flex flex-col w-full details text-left">
        <div className="font-semibold">{audio.name}</div>
        <div className="text-xs"><Artists artists={audio.artists} /></div>
    </div>
);

export const formatDuration = (value: number) => {
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
        id: 'image',
        cell: info => <div className="image"><img src={info.row.original.imageUrl} /></div>
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
    playlistId!: number;
    state = 0;

    constructor() {
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
    }

    setPlaylistId(id: number) {
        this.playlistId = id;
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
        this.state++;
    }

    fetch(): Promise<Page<Track> | null> {

        this.isFetching = true;
        const state = this.state;
        return fetchPage('playlists', this.playlistId, this.pageable).then(page => {
            if (state !== this.state) {
                return null;
            }
            this.isLoaded = page.number === page.totalPages - 1;
            this.fetchedContent = [...this.fetchedContent, ...page.content];
            this.isFetching = false;
            if (!this.isLoaded) {
                this.pageable = nextPageable(this.pageable);
            }
            return page;
        })
    }

}


export const FavoritesPage = () => {

    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlist, setPlaylist] = useState<Playlist>();

    const queue = new Queue();

    useEffect(() => {
        getHttp<Playlist[]>("/playlists/search", {value: "__USER__FAVORITES__"})
            .then(playlists => playlists[0])
            .then(playlist => {
                setPlaylist(playlist);
                queue.setPlaylistId(playlist?.id);
                return queue.fetch();
            })
            .then(() => setTracks(queue.fetchedContent));
    }, [])

    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const columns = React.useMemo<ColumnDef<Track>[]>(() => _columns, []);

    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget as HTMLElement;
        if (queue.playlistId && !queue.isFetching && !queue.isLoaded && scrollHeight - scrollTop - clientHeight < 1000) {
            queue.fetch().then(() => setTracks(queue.fetchedContent));
        }
    };

    const table = useReactTable({
        data: tracks,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()

    const startPlaylist = (trackIndex: number) => {
        playPlaylistFacade(playlist!.id, trackIndex)
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
                    <img src='https://s3.ap-south-1.amazonaws.com/discovery-prod-arsenal/ziegel/liked-songs.png'/>
                </div>
                <div className='playlist-header-info'>
                    <h2>Liked songs</h2>
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


const QueueItem = ({ row, handleClick, updateTrack }: { updateTrack: any, row: Row<Track>, handleClick: any}) => {

    const playerState = useSelector<RootState>(state => state.player) as PlayerState;

    const onClickHandler = (column: string, track: Track) => {
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
        <tr className={`queue-item flex items-center ${playerState.currentTrack?.id === row.original.id ? 'active' : ''}`} onClick={handleClick}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td onClick={() => onClickHandler(cell.column.id, cell.row.original)} className={`${cell.column.id} py-2`} key={cell.id}>
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
