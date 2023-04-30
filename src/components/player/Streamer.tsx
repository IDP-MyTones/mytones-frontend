import React from 'react';
import {Slider} from "@mui/material";

import Box from '@mui/material/Box';
import {useSelector} from "react-redux";
import {RootState, store} from "../../store/store";
import {
    fetchTrack,
    pause,
    play,
    PlayerState,
    repeat,
    RepeatType,
    shuffle
} from "../../store/player/player.reducer";
import {Track} from "../../models/track";
import player from "../../store/player/player";

export const Streamer = () => {

    const playerState = useSelector<RootState>(state => state.player) as PlayerState;

    // const [current, setCurrent] = useState(0);
    // const [duration, setDuration] = useState(0);
    //
    // let subscription = playerService.playerInfo$().subscribe(({paused, played, duration}: any) => {
    //     setCurrent(played);
    //     setDuration(duration);
    // })

    // useEffect( () => () => subscription.unsubscribe(), [] );

    const handleChange = (time: number) => {
        // playerService.play(x);
        store.dispatch(play({ time }))
    }

    return (
        <MusicPlayerSlider playerState={playerState}
                           handleChange={handleChange} />

    )
}

export const MusicPlayerSlider = ({playerState, handleChange}: {playerState: PlayerState, handleChange: (x: number) => void}) => {

    const formatDuration = (value: number) => {
        if (isNaN(value)) {
            return "-:-";
        }
        const minute = Math.floor(value / 60);
        const secondLeft = Math.floor(value - minute * 60);
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    const handleShuffle = () => {
        store.dispatch(shuffle());
    }

    const handlePrev = () => {
        if (playerState.loading || isNaN(playerState.currentTrackIndex!)) {
            return;
        }
        const queueOrderIndex = (playerState.currentTrackIndex! - 1 + playerState.queueOrder.length) % playerState.queueOrder.length;
        const queueIndex = playerState.queueOrder[queueOrderIndex!];

        store.dispatch(fetchTrack({queueIndex, queueOrderIndex}));
    }

    const handleNext = () => {
        if (playerState.loading || isNaN(playerState.currentTrackIndex!)) {
            return;
        }
        const queueOrderIndex = (playerState.currentTrackIndex! + 1) % playerState.queueOrder.length;
        const queueIndex = playerState.queueOrder[queueOrderIndex!];

        console.log(playerState.currentTrackIndex)

        store.dispatch(fetchTrack({queueIndex, queueOrderIndex}));
    }

    const handlePlay = () => {
        if (playerState.loading || isNaN(playerState.currentTrackIndex!)) {
            return;
        }
        store.dispatch(play());
    }

    const handlePause = () => {
        if (playerState.loading || isNaN(playerState.currentTrackIndex!)) {
            return;
        }
        store.dispatch(pause());
    }

    const handleRepeat = () => {
        store.dispatch(repeat())
    }

    return (
        <>
            {playerState.currentTrack &&
                <div className="mx-5 border-t-2 border-t-gray-400 mt-3 pt-3">
                    <h3 className="streamer-header">NOW PLAYING</h3>

                    <div className="streamer-image">
                        <img src={playerState.currentTrack?.imageUrl}/>
                    </div>

                    <div className="streamer-track-info">
                        <div className="title">{playerState.currentTrack.name}</div>
                        <div className="artists">{playerState.currentTrack.artists.map(a => a.name).join(", ")}</div>
                    </div>

                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={playerState.currentTrackTime || 0}
                        min={0}
                        step={1}
                        max={playerState.currentTrackDuration || 0}
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
                        <div>{formatDuration(playerState.currentTrackTime!)}</div>
                        <div>{formatDuration(playerState.currentTrackDuration!)}</div>
                    </Box>

                    <div className="streamer-controls flex justify-between">
                        <div className={`shuffle ${playerState.shuffled ? '' : 'disabled'}`} onClick={handleShuffle}><i
                            className="fa-solid fa-shuffle"></i></div>
                        <div className="prev" onClick={handlePrev}><i className="fa-solid fa-backward-step"></i></div>
                        {playerState.paused &&
                            <div className="play" onClick={handlePlay}><i className="fa-solid fa-circle-play"></i>
                            </div>}
                        {!playerState.paused &&
                            <div className="stop" onClick={handlePause}><i className="fa-solid fa-circle-pause"></i>
                            </div>}
                        <div className="next" onClick={handleNext}><i className="fa-solid fa-forward-step"></i></div>
                        <div className={`repeat ${playerState.repeatType === RepeatType.NONE ? 'disabled' : ''}`}
                             onClick={handleRepeat}>
                            <i className="fa-solid fa-repeat"></i>
                            {playerState.repeatType === RepeatType.TRACK &&
                                <div className="repeat-1">1</div>
                            }
                        </div>
                    </div>
                </div>
            }
            </>
    );
}

