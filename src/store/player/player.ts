import {store} from "../store";
import {fetchTrack, pause, refresh, RepeatType} from "./player.reducer";

const audio = new Audio();

// const _play = () => {
//
//     const playlist = store.getState().queue.playlist;
//     const player = store.getState().player;
//
//     return fetchStreamableTrack(playlist!.id, player.queueOrder[player.currentTrackIndex!])
//         .then(({ url }) => store.getState().player)
//
//     return play(store.getState().player.currentTrackTime, )
// }

// endTrack: state => {
//     if (state.repeatType === RepeatType.NONE && state.currentTrackIndex === state.queueOrder.length) {
//         return;
//     }
//
//     state.currentTrackTime = 0;
//     if (state.repeatType === RepeatType.TRACK) {
//         return void Player.play();
//     }
//
//     state.currentTrackDuration = state.currentTrack!.duration;
//     state.currentTrackIndex = (state.currentTrackIndex! - 1 + state.queueOrder.length) % state.queueOrder.length;
//     void Player.play(state.currentTrackTime, state.currentTrack!.url);
// },

const play = (time?: number, url?: string): Promise<number> => {
    if (url) {
        audio.src = url;
    }

    if (!isNaN(time!)) {
        audio.currentTime = time!;
    }

    return audio.play().then(() => audio.duration);
}

const details = (): { duration: number, currentTime: number } => {
    const { duration, currentTime } = audio;
    return { duration, currentTime };
}

let intervalId: any;
audio.onplay = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => store.dispatch(refresh(details())), 1000);
}

audio.onended = () => {
    store.dispatch(refresh(details()));

    const state = store.getState().player;
    if (state.repeatType === RepeatType.NONE && state.currentTrackIndex === state.queueOrder.length - 1) {
        store.dispatch(pause());
        clearInterval(intervalId);
        return;
    }

    let x = new HTMLVideoElement();
    x.controls
    if (state.repeatType === RepeatType.TRACK) {
        return void play();
    }

    if (state.loading || isNaN(state.currentTrackIndex!)) {
        return;
    }
    const queueOrderIndex = (state.currentTrackIndex! + 1) % state.queueOrder.length;
    const queueIndex = state.queueOrder[queueOrderIndex!];

    clearInterval(intervalId);
    store.dispatch(fetchTrack({queueIndex, queueOrderIndex}));
}

export default {
    pause: () => {
        audio.pause();
    }, play
}
