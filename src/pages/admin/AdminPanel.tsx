import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import React, {useEffect, useState} from "react";
import {getHttp, simplePutHttp} from "../../service/http";
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {FormControl, MenuItem, OutlinedInput} from "@mui/material";
import Select from '@mui/material/Select';
import {UserState} from "../../store/user.reducer";
import {range} from "../../utils/array";
import TextField from "@mui/material/TextField";
import {success} from "../../store/snack.reducer";

interface User {
    role: string;
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}

const columnHelper = createColumnHelper<User>();
let _updateUserRole: any;
const _columns = [
    columnHelper.display({
        id: 'id',
        cell: info => <div className="id">{info.row.original.id}</div>,
        header: 'ID'
    }),
    columnHelper.display({
        id: 'username',
        cell: info => <div className="username">{info.row.original.username}</div>,
        header: 'Username'
    }),
    columnHelper.display({
        id: 'firstName',
        cell: info => <div className="firstName">{info.row.original.firstName}</div>,
        header: 'First name'
    }),
    columnHelper.display({
        id: 'lastName',
        cell: info => <div className="lastName">{info.row.original.lastName}</div>,
        header: 'Last name'
    }),
    columnHelper.display({
        id: 'role',
        cell: info => <div>
            <FormControl sx={{ m: 1, width: 'fit', fontSize: '11px' }}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={info.row.original.role}
                    onChange={role => _updateUserRole(info.row.original.id, role)}
                    input={<OutlinedInput sx={{fontSize: '12px'}} />}
                >
                    {['ADMIN', 'MODERATOR', 'CLIENT'].map((role) => (
                        <MenuItem
                            key={role}
                            value={role}
                            sx={{fontSize: '12px'}}
                        >
                            {role}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>,
        header: 'Role'
    })
];

export const AdminPanelPage = () => {
    const navigate = useNavigate();
    const currentUserState = useSelector<RootState>(state => state.user) as UserState;
    const [users, setUsers] = useState<User[]>([])
    const [tableData, setTableData] = useState<User[]>([]);

    useEffect(() => {
        if (currentUserState.role !== 'ADMIN') {
            navigate("/");
        }
        _updateUserRole = updateUserRole;

        fetchUsers();
    }, [currentUserState])

    const columns = React.useMemo<ColumnDef<User>[]>(() => _columns, []);

    const fetchUsers = () => {
        getHttp<User[]>("/admin/users")
            .then(u => {
                setUsers(u);
            })
    }

    const table = useReactTable({
        data: tableData,
        columns,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()

    const updateUserRole = (userId: number, role: any) => {
        void simplePutHttp(`/admin/users/${userId}/role`, role.target.value)
            .then(fetchUsers)
            .then(() => store.dispatch(success("Role changed")))
    }

    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        if (filterValue) {
            const value = filterValue.toLowerCase();
            const data = users.filter(({ firstName, lastName, username }) =>
                firstName.toLowerCase().includes(value) || lastName.toLowerCase().includes(value) || username.toLowerCase().includes(value))

            setTableData(data)
        } else {
            setTableData(users)
        }
    }, [filterValue, users])

    return (
        <div className='flex flex-col max-h-full'>
            <div className='queue-container flex flex-wrap justify-between mx-2 max-h-full overflow-y-scroll pr-10 -mr-10'>
                <div className="pb-3">
                    <TextField placeholder="Filter" value={filterValue} onChange={e => setFilterValue(e.target.value)} />
                </div>
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='border'>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>{
                        rows.map((row, index) => <tr key={row.index}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td className={`${cell.column.id} ${cell.column.id === 'role' ? 'w-32' : ''} border`} key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    )}</tbody>
                </table>
            </div>
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
    )
}