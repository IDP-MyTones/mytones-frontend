import React from 'react';
import logo from '../../assets/images/logo.png';
import './Sidebar.scss';
import {Link, useNavigate} from "react-router-dom";
import {RootState, store} from "../../store/store";
import {logoutAction} from "../../store/user.reducer";
import {useSelector} from "react-redux";

export const Sidebar =  () => {
    const role = useSelector<RootState>(state => state.user.role);
    const navigate = useNavigate();

    const logout = () => {
        store.dispatch(logoutAction());
        navigate("/login");
    }

    return <div className='sidebar-wrapper flex flex-col py-6'>
        <div className='sidebar-logo'>
            <img src={logo}/>
        </div>
        <ul className='sidebar-links h-full flex flex-col justify-between'>
            <div className="flex flex-col">
                <Link to={'/explore'}>
                    <li><i className="fa-solid fa-magnifying-glass"></i> Explore</li>
                </Link>
                <Link to={'/'}>
                    <li><i className="fa-solid fa-heart"></i> Favorites</li>
                </Link>
                <Link to={'/playlists'}>
                    <li className="mb-10"><i className="fa-solid fa-book"></i> Playlists</li>
                </Link>
                {(role === 'ADMIN' || role === 'MODERATOR') && (
                    <>
                        <Link to={'/upload'}>
                            <li><i className="fa-solid fa-cloud-arrow-up"></i> Upload</li>
                        </Link>
                        <Link to={'/manage/artists'}>
                            <li><i className="fa-solid fa-user-pen"></i> Artist management</li>
                        </Link>
                    </>
                )}
                {role === 'ADMIN' &&
                    <Link to={'/admin'}>
                        <li><i className="fa-solid fa-toolbox"></i> Admin panel</li>
                    </Link>
                }
            </div>
            <div>
                <li onClick={logout}><i className="fa-solid fa-right-from-bracket"></i>Logout
                </li>
            </div>
        </ul>
    </div>
}
