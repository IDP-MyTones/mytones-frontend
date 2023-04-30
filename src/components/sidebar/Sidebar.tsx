import React from 'react';
import logo from '../../assets/images/logo.png';
import './Sidebar.scss';

export const Sidebar =  () => (
    <div className='sidebar-wrapper flex flex-col py-6'>
        <div className='sidebar-logo'>
            <img src={logo}/>
        </div>
        <ul className='sidebar-links h-full flex flex-col justify-between'>
            <div className="flex flex-col">
                <li><i className="fa-solid fa-compass"></i> Explorer</li>
                <li><i className="fa-solid fa-heart"></i> Favorites</li>
                <li className="mb-10"><i className="fa-solid fa-book"></i> Playlists</li>
                <li><i className="fa-solid fa-cloud-arrow-up"></i> Upload</li>
                <li><i className="fa-solid fa-user-pen"></i> Artist management</li>
                <li><i className="fa-solid fa-toolbox"></i> Admin panel</li>
            </div>
            <div>
                <li><i className="fa-solid fa-gears"></i>Settings</li>
                <li><i className="fa-solid fa-right-from-bracket"></i>Logout</li>
            </div>
        </ul>
    </div>
);
