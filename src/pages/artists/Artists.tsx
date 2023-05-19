import {nextPageable, Page, Pageable} from "../../utils/pagination";
import {Artist} from "../../models/artist";
import {ColumnDef, createColumnHelper, flexRender, getCoreRowModel, Row, useReactTable} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import './Artists.scss';
import {ImageLoader} from "../../components/images/loading";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import {getHttp, putHttp} from "../../service/http";

const columnHelper = createColumnHelper<Artist>();

const _columns = [
    columnHelper.display({
        id: 'index',
        cell: info => '#' + info.row.original.id
    }),
    columnHelper.display({
        id: 'image',
        cell: info => <img src={info.row.original.imageUrl} />
    }),
    columnHelper.display({
        id: 'name',
        cell: info => info.row.original.name
    }),
];

class ArtistsWrapper {
    fetchedContent: Artist[] = [];
    pageable: Pageable;
    isFetching: boolean;
    isLoaded: boolean;

    constructor() {
        this.pageable = {page: 0, size: 10};
        this.isFetching = false;
        this.isLoaded = false;
    }

    fetch(): Promise<Page<Artist>> {
        this.isFetching = true;
        return this.fetchArtists(this.pageable).then(page => {
            this.pageable = nextPageable(this.pageable);
            this.isLoaded = page.number === page.totalPages;
            this.fetchedContent = [...this.fetchedContent, ...page.content];
            this.isFetching = false;
            return page;
        })
    }

    fetchArtists(pageable: Pageable): Promise<Page<Artist>> {
        return getHttp("/artists/search", {...pageable, value: ''});
    }
}

const artistsWrapper = new ArtistsWrapper();


export const ArtistsPage = () => {
    const [artists, setArtists] = useState<Artist[]>([]);

    const [selected, setSelected] = useState<Row<Artist> | null>(null);

    useEffect(() => {
        if (!artistsWrapper.isFetching) {
            artistsWrapper.fetch().then(() => setArtists(artistsWrapper.fetchedContent));
        }
    }, [])

    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const columns = React.useMemo<ColumnDef<Artist>[]>(() => _columns, []);


    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget as HTMLElement;
        if (!artistsWrapper.isFetching && scrollHeight - scrollTop - clientHeight < 1000) {
            artistsWrapper.fetch().then(() => setArtists(artistsWrapper.fetchedContent));
        }
    };

    const table = useReactTable({
        data: artists,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()

    const open = (artist: Row<Artist>) => setSelected(artist);

    const onUpdated = (artist: Artist, index: number) => {
        const newArtists = [...artists];
        newArtists[index] = artist;
        setArtists(newArtists);
        if (artist.imageUrl?.startsWith("data:")) {
            fetch(artist.imageUrl)
                .then(x => x.arrayBuffer())
                .then(arrayBuffer => btoa(
                    new Uint8Array(arrayBuffer)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                ))
                .then(x => artist.imageUrl = x)
                .then(() => putHttp(`/artists/${artist.id}`, artist))
                .then(({ imageUrl }: any) => artist.imageUrl = imageUrl);
        } else {
            void putHttp(`/artists/${artist.id}`, {...artist });
        }
    }

    return <div className="flex h-full">
        <div className='artists-table'
             onScroll={handleScroll}
             ref={tableContainerRef}>
            <table>
                <tbody>{
                    rows.map(row => (<TableRow row={row} active={!!selected && selected.original.id === row.original.id} handleClick={() => open(row)} key={row.id}/>))
                }</tbody>
            </table>
        </div>
        {selected && <div className="w-1/3 ml-5"><SelectedArtistComponent artist={selected.original} onUpdate={artist => onUpdated(artist, selected?.index)} /></div>}
    </div>
}

const SelectedArtistComponent = ({ artist, onUpdate }: {artist: Artist, onUpdate: (artist: Artist) => void}) => {

    const changeImage = (url: string) => {
        artist.imageUrl = url;
        onUpdate(artist);
    }

    const [name, setName] = useState(artist.name);
    const [changeName, setChangeName] = useState(false);
    const changeNameHandler = () => {
        if (changeName) {
            artist.name = name;
            onUpdate(artist);
            setChangeName(false);
        } else {
            setChangeName(true);
        }
    }

    const [description, setDescription] = useState(artist.description);
    const [changeDescription, setChangeDescription] = useState(false);
    const changeDescriptionHandler = () => {
        if (changeDescription) {
            artist.description = description;
            onUpdate(artist);
            setChangeDescription(false);
        } else {
            setChangeDescription(true);
        }
    }

    useEffect(() => {
        setName(artist.name)
        setChangeName(false);
        setDescription(artist.description);
        setChangeDescription(false);
    }, [artist]);


    return <div className="artist-profile-wrapper flex flex-col items-center">
        <div className="artist-image w-64 h-64 rounded-full overflow-hidden relative">
            <ImageLoader url={artist.imageUrl} onChange={changeImage}/>
        </div>

        <h2 className="artist-name font-bold text-2xl my-2 cursor-pointer" onClick={() => changeNameHandler()}>
            {changeName ?
                <input type='text'
                       onChange={x => setName(x.target.value)}
                       onKeyUp={x => x.key.toLowerCase() === 'enter' && changeNameHandler()}
                       autoFocus
                       value={name} />
                :
                <>{artist.name} <i className="text-base fa-solid fa-pen"></i></>
            }
        </h2>

        <p className="w-full text-xs" onClick={() => changeDescriptionHandler()}>Description:</p>
        <p className="artist-description w-full">
            {changeDescription ?
                <textarea
                       className="w-full h-60"
                       onChange={x => setDescription(x.target.value)}
                       onKeyUp={x => x.key.toLowerCase() === 'enter' && changeDescriptionHandler()}
                       autoFocus
                       value={description}></textarea>
                :
                artist.description}
        </p>
    </div>
}



const TableRow = ({ row, handleClick, active }: {row: Row<Artist>, handleClick: any, active: boolean}) => {

    return (
        <tr className={`item ${active ? 'active' : ''}`} onClick={() => handleClick(row.original)}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td className={`${cell.column.id} py-2`} key={cell.id}>
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