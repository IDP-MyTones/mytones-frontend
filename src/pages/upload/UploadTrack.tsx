import {Track, UploadedTrack} from "../../models/track";
import React, {createRef, useEffect, useState} from "react";
import {readFile} from "../../components/images/loading";
import {Slider} from "@mui/material";
import Box from "@mui/material/Box";
import {Artist, SimpleArtist} from "../../models/artist";
import {SelectArtists} from "./SelectArtistsDialog";


const formatDuration = (value: number) => {
    if (isNaN(value)) {
        return "-:-";
    }
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const audio = new Audio();
let inter: any;
let onPauseHandler: () => void;

const play = (url: string, time: number, onProgress: () => void, onPause: () => void) => {
    pause();
    audio.src = url;
    audio.currentTime = time;
    onPauseHandler = onPause;
    inter = setInterval(onProgress, 500);
    return audio.play();
}

export const pause = (force?: boolean) => {
    if (!audio.paused || force) {
        if (onPauseHandler) onPauseHandler();
        if (!force) audio.pause();
        if (inter) clearInterval(inter)
    }
}
audio.onpause = () => pause(true);

interface UploadTrackArtistsProps {
    track: Partial<UploadedTrack>,
    onUpdate: (track: Partial<UploadedTrack>) => void;
}

export const UploadTrackArtists = (props: UploadTrackArtistsProps) => {

    let {track, onUpdate} = props;

    const onLoadTrack = ({url, trackTime, name}: {url: string, trackTime: number, name:string}) => {
        track.url = url;
        track.duration = trackTime;
        track.name = name;

        onUpdate(track);
    }

    const updateArtists = (artists: SimpleArtist[]) => {
        track.artists = artists;
        onUpdate(track);
    }

    return <div className="flex">
        <UploadTrack onload={onLoadTrack} />
        <SelectArtists selectedArtists={track.artists!} setSelectedArtists={updateArtists}/>
    </div>

}

export const UploadTrack = ({onload}: {onload: (t: {url: string, trackTime: number, name: string}) => void}) => {
    const [url, setUrl] = useState<string>('');
    const [currentTime, setCurrentTime] = useState(0);
    const [trackTime, setTrackTime] = useState(0);

    const inputRef = createRef<HTMLInputElement>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [name, setName] = useState('');

    const loadTrack = () => {
        readFile(inputRef.current!.files![0]).then(x => {
            setUrl(x as string)
            setCurrentTime(0);
        })
        setName(inputRef.current!.files![0].name)
    }

    useEffect(() => {
        if (!url) return;
        setIsPlaying(true);
        void play(url, currentTime + 100 > trackTime ? 0 : currentTime, () => {
            setTrackTime(audio.duration);
            setCurrentTime(audio.currentTime);
        }, () => setIsPlaying(false))
    }, [url])

    useEffect(() => {
        onload({
            url, trackTime, name
        })
    }, [url, name, trackTime])

    const handleChange = (value: number) => {
        setCurrentTime(value);
        if (isPlaying) {
            audio.currentTime = value;
        }
    }

    const handlePlay = () => {
        if (!isPlaying && url) {
            setIsPlaying(true);
            play(url, currentTime + 100 > trackTime ? 0 : currentTime, () => {
                setTrackTime(audio.duration);
                setCurrentTime(audio.currentTime);
            }, () => setIsPlaying(false));
        }
    }

    const handleStop = () => {
        if (isPlaying) {
            setIsPlaying(false);
            pause();
        }
    }

    return <div className="track-uploader">
        <input type="file" accept=".mp3" onChange={loadTrack} ref={inputRef} hidden/>

        <button className="mx-3" onClick={() => inputRef.current?.click()}><i className="fa-solid fa-upload"></i></button>

        {url &&
            (
                !isPlaying
                    ? <button className="mx-3" onClick={handlePlay}><i className="fa-solid fa-play"></i></button>
                    : <button className="mx-3" onClick={handleStop}><i className="fa-solid fa-pause"></i></button>
            )
        }

        <input className="mx-3 w-80" type="text" onChange={e => setName(e.target.value)} value={name} placeholder="Name" />

        <Slider
            aria-label="time-indicator"
            size="small"
            value={currentTime}
            min={0}
            step={1}
            max={trackTime}
            onChange={(_, value) => handleChange(value as number)}
            sx={{
                color: '#4343EF',
                height: 4,
                '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                },
                '& .MuiSlider-rail': {
                    color: '#B4B4F8'
                },
            }}
        />
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: -2,
            }}
        >
            <div>{formatDuration(currentTime)}</div>
            <div>{formatDuration(trackTime)}</div>
        </Box>

    </div>
}