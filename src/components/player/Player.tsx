import React from 'react';
import { Queue } from "./Queue";
import { Streamer } from "./Streamer";
import "./Player.scss";

export const Player = () => (
    <div className="flex flex-col justify-between h-full pb-8 pt-6" style={{height: "95%"}}>
        <Queue />
        <Streamer />
    </div>
)


