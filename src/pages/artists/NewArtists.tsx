import {Artist} from "../../models/artist";
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    Row,
    useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import './Artists.scss';
import {ImageLoader} from "../../components/images/loading";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import {deleteHttp, getHttp, putHttp} from "../../service/http";
import TextField from "@mui/material/TextField";
import {error, success} from "../../store/snack.reducer";
import {store} from "../../store/store";
import {CreateArtist} from "./CreateArtist";

const columnHelper = createColumnHelper<Artist>();

let deleteArtist: any;

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
    columnHelper.display({
        id: 'delete',
        cell: info => <div className="actions-love hover:text-blue-600 justify-center flex w-24" onClick={() => deleteArtist(info.row.original.id)}><i className="fa-solid fa-trash-can"></i></div>
    }),
];

export const NewArtistsPage = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [filterValue, setFilterValue] = useState('');
    const [tableData, setTableData] = useState<Artist[]>([]);
    const [selected, setSelected] = useState<Row<Artist> | null>(null);

    useEffect(() => {
        if (!filterValue) {
            setTableData(artists)
        } else {
            const value = filterValue.toLowerCase();
            const data = artists.filter(({name}) => name.toLowerCase().indexOf(value) !== -1)
            setTableData(data);
        }
    }, [filterValue, artists])

    useEffect(() => {
        fetchArtists();
    }, [])

    const fetchArtists = () => {
        getHttp<Artist[]>('/artists/search', {value: ''})
            .then(setArtists)
    }

    deleteArtist = (id: number) => {
        deleteHttp(`/artists/${id}`)
            .then(fetchArtists)
            .then(() => {
                if (selected?.original?.id === id) {
                    setSelected(null)
                }
            })
            .then(() => store.dispatch(success("Artist successfully deleted")))
    }

    const columns = React.useMemo<ColumnDef<Artist>[]>(() => _columns, []);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                .then(({ imageUrl }: any) => artist.imageUrl = imageUrl)
                .then(() => store.dispatch(success("Artist successfully updated")))
                .catch(e => store.dispatch(error("Error on update artist")));
        } else {
            void putHttp(`/artists/${artist.id}`, {...artist })
                .then(() => store.dispatch(success("Artist successfully updated")))
                .catch(e => store.dispatch(error("Error on update artist")));
        }
    }


    return <div className="flex h-full">
        <div className='artists-table'>
             <div className="mb-5 px-4 flex items-center">
                <CreateArtist handleCreated={fetchArtists}/>
                <TextField
                    type="text"
                    value={(filterValue ?? '') as string}
                    onChange={e => setFilterValue(e.target.value)}
                    placeholder={`Search...`}
                    className="border shadow rounded"
                    sx={{marginLeft: '15px'}}
                />
            </div>
            <table>
                <tbody>{
                    rows.map(row => (<TableRow row={row} active={!!selected && selected.original.id === row.original.id} handleClick={() => open(row)} key={row.index}/>))
                }</tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                  <div>Page</div>
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                  </strong>
                </span>
             </div>
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

    const clicked = (columnId: string) => {
        if (columnId !== 'delete') {
            handleClick(row.original);
        }
    }

    return (
        <tr className={`item ${active ? 'active' : ''}`}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td className={`${cell.column.id} py-2`} onClick={() => clicked(cell.column.id)} key={cell.id}>
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