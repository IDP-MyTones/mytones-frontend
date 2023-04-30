import React from 'react';
import './Player.scss';
import {
    ColumnDef,
    Row,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import {fetchQueuePage, QueueState} from "../../store/queue/queue.reducer";
import {Track} from "../../models/track";
import {fetchTrack} from "../../store/player/player.reducer";

const columnHelper = createColumnHelper<Track>();

const AudioDetails = ({ audio }: {audio: Track}) => (
    <div className="flex flex-col w-full details text-left">
        <div className="font-semibold">{audio.name}</div>
        <div className="text-sm">{audio.artists.map(a => a.name).join(", ")}</div>
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
        cell: info => <div className="actions"><i className="fa-solid fa-ellipsis"></i></div>
    })
];


export const Queue = () => {

    const queueStore = useSelector<RootState>(state => state.queue) as QueueState;
    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const columns = React.useMemo<ColumnDef<Track>[]>(() => _columns, []);


    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget as HTMLElement;
        if (queueStore.totalTracks !== queueStore.fetchedTracks.length &&
            !queueStore.isFetching && scrollHeight - scrollTop - clientHeight < 300) {
            store.dispatch(fetchQueuePage())
        }
    };

    const table = useReactTable({
        data: queueStore.fetchedTracks,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()

    return (
        <div
            className="queue-container"
            onScroll={handleScroll}
            ref={tableContainerRef}
        >
            <table>
                <tbody>{
                    rows.map(row => (<QueueItem row={row} key={row.id} />))
                }</tbody>
            </table>
        </div>
    )
}


const QueueItem = ({ row }: {row: Row<Track>}) => {

    const handleClick = () => {
        store.dispatch(fetchTrack({queueIndex: row.index}))
    }

    return (
        <tr className="queue-item" onClick={handleClick}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td className={cell.id} key={cell.id}>
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
