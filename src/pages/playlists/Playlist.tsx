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
import {useParams} from "react-router-dom";
import {Playlist, SimplePlaylist} from "../../models/playlist";
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import {PlayerState} from "../../store/player/player.reducer";
import {deleteHttp, getHttp, postHttp, putHttp, simplePostHttp, simplePutHttp} from "../../service/http";

import NoImg from '../../assets/images/no-img.png';
import {AddTrack} from "./AddTrack";
import {ImageLoader} from "../../components/images/loading";
import {urlToBase64} from "../upload/Upload";
import { TextField } from '@mui/material';
import {error, success} from "../../store/snack.reducer";

const columnHelper = createColumnHelper<Track>();

const AudioDetails = ({ audio }: {audio: Track}) => (
    <div className="flex flex-col w-full details text-left">
        <div className="font-semibold">{audio.name}</div>
        <div className="text-xs">{audio.artists.map(a => a.name).join(", ")}</div>
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
        id: 'actions-love',
        cell: info => {
            if (info.row.original.inFavorites) {
                return <div className="actions"><i className="fa-solid fa-heart"></i></div>
            } else {
                return <div className="actions"><i className="fa-sharp fa-regular fa-heart"></i></div>
            }
        }
    }),
    columnHelper.display({
        id: 'actions-delete',
        cell: info => {
            return <div className="actions"><i className="fa-solid fa-trash-can"></i></div>
        }
    })

];

class Queue {

    fetchedContent: Track[] = [];
    pageable: Pageable;
    isFetching: boolean;
    isLoaded: boolean;
    albumId?: number;
    state = 0;

    constructor() {
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
    }

    reset(albumId: number) {
        this.albumId = albumId;
        this.pageable = {page: 0, size: 30};
        this.isFetching = false;
        this.isLoaded = false;
        this.state++;
    }

    fetch(): Promise<Page<Track> | null> {
        this.isFetching = true;
        const state = this.state;
        return fetchPage('playlists', this.albumId!, this.pageable).then(page => {
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

const _fetchPlaylist = () => {

    let isFetching = false;
    let promise: Promise<SimplePlaylist>;

    return (id: string | number | undefined) => {
        if (isFetching) {
            return promise;
        }

        isFetching = true;
        promise = getHttp<SimplePlaylist>(`/playlists/${id}`)
            .then(x => {
                isFetching = false;
                return x;
            })

        return promise;
    }

}

const fetchPlaylist = _fetchPlaylist();

export const PlaylistPage = () => {

    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlist, setPlaylist] = useState<SimplePlaylist>();
    const [edit, setEdit] = useState(false);
    const [playlistName, setPlaylistName] = useState<string>('')
    const { id } = useParams();

    const queue = new Queue();
    queue.reset(+id!)

    useEffect(() => {
        queue.reset(+id!);
        setTracks(queue.fetchedContent)
    }, [])

    useEffect(() => {
        if (isNaN(Number(id))) {
            return;
        }

        if (playlist?.id !== +id!) {
            queue.reset(+id!);
            setTracks(queue.fetchedContent)
            fetchPlaylist(+id!).then(p => {
                if (p.id !== playlist?.id) setPlaylist(p);
            });
        }
    }, [id])

    useEffect(() => {
        if (!playlist) {
            return
        }
        if (isNaN(Number(id))) {
            return;
        }
        queue.reset(+id!);
        setTracks(queue.fetchedContent)

        if (!queue.isFetching && !queue.isLoaded) {
            queue.fetch().then(() => setTracks(queue.fetchedContent));
        }
    }, [playlist])

    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const columns = React.useMemo<ColumnDef<Track>[]>(() => _columns, []);


    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget as HTMLElement;
        if (!queue.isFetching && scrollHeight - scrollTop - clientHeight < 1000) {
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

    const addTrack = (track?: Track) => {
        if (!track) {
            return;
        }
        simplePostHttp(`/playlists/${playlist?.id}/tracks/${track.id}`)
            .then(() => queue.fetch())
            .then(() => setTracks(queue.fetchedContent))
            .then(() => store.dispatch(success("Track added successfully")))
            .catch(() => store.dispatch(error("Error on adding track")))
    }

    const onDeleteTrack = (index: number) => {

        deleteHttp(`/playlists/${playlist?.id}/tracks/${tracks[index].id}`)
            .then(() => {
                const size = queue.pageable.size;
                const pageNumber = index / size;

                queue.pageable = {
                    size,
                    page: pageNumber
                }

                queue.fetchedContent = queue.fetchedContent.slice(0, pageNumber * size);
                setTracks(queue.fetchedContent)
                queue.fetch().then(() => setTracks(queue.fetchedContent))
            })
            .then(() => store.dispatch(success("Track deleted successfully")))
            .catch(() => store.dispatch(error("Error on delete track")))
    }

    const onUpdateTrack = (index: number, track: Track) => {
        const _tracks = [...tracks];
        _tracks[index] = track;
        setTracks(_tracks);
        queue.fetchedContent = _tracks
    }

    const updatePlaylistImage = (url: string) => {
        const content = urlToBase64(url);
        const updated = {
            ...playlist!,
            imageUrl: url
        }

        simplePutHttp(`/playlists/${playlist?.id}/image`, content)
            .then(() => setPlaylist(updated))
            .then(() => store.dispatch(success("Playlist updated successfully")))
            .catch(() => store.dispatch(error("Error on update playlist track")))
    }

    const changeEdit = () => {
        if (!edit) {
            setPlaylistName(playlist?.name!)
            setEdit(true);
        } else {
            setEdit(false);

            const updated = {
                ...playlist!,
                name: playlistName
            }

            simplePutHttp(`/playlists/${playlist?.id}`, playlistName)
                .then(() => setPlaylist(updated))
                .then(() => store.dispatch(success("Playlist updated successfully")))
                .catch(() => store.dispatch(error("Error on update playlist track")))

        }
    }

    return (
        <div className='flex flex-col max-h-full' style={{paddingBottom: "40px"}}>
            <div className='playlist-header'>
                <div className='playlist-header-img relative'>
                    <ImageLoader onChange={updatePlaylistImage} url={playlist?.imageUrl || NoImg} />
                </div>
                <div className='playlist-header-info'>
                    <h2>
                        {
                            edit
                                ? <TextField value={playlistName}
                                             onChange={e => setPlaylistName(e.target.value)}
                                             onKeyUp={e => e.key.toLowerCase() === 'enter' && changeEdit()} />
                                : <div onClick={changeEdit}>{playlist?.name}</div>
                        }

                    </h2>

                    <AddTrack selectTrack={addTrack} />
                </div>
            </div>

            <div className='queue-container flex flex-wrap justify-between mx-2 max-h-full overflow-y-scroll pr-10 -mr-10'
                 onScroll={handleScroll}
                 ref={tableContainerRef}>
                <table>
                         <tbody>{
                             rows.map((row, index) => (
                                 <QueueItem updateTrack={(t: Track) => onUpdateTrack(index, t)}
                                            row={row} key={row.id}
                                            handleClick={() => startPlaylist(row.index)}
                                            onDeleteTrack={() => onDeleteTrack(index)}/>
                             ))
                         }</tbody>
                </table>
            </div>
        </div>
    )
}


const QueueItem = ({ row, handleClick, updateTrack, onDeleteTrack }: {updateTrack: any, onDeleteTrack: any, row: Row<Track>, handleClick: any}) => {

    const playerState = useSelector<RootState>(root => root.player) as PlayerState;

    const onClickHandler = (column: string, track: Track) => {
        if (column === 'actions-love') {
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
        } else if (column === 'actions-delete') {
            onDeleteTrack(track);
        } else {
            handleClick();
        }
    }

    return (
        <tr className={`queue-item ${playerState.currentTrack?.id === row.original.id ? 'active' : ''}`}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td className={`${cell.column.id} py-2`} key={cell.id} onClick={() => onClickHandler(cell.column.id, cell.row.original)}>
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
