import {store} from "../store";
import {pause, playTrackFacade, refresh, RepeatType} from "./player.reducer";

const audio = new Audio();

const play = (time?: number, url?: string): Promise<number> => {
    if (url) {
        audio.src = url;
    }

    if (!isNaN(time!)) {
        audio.currentTime = time!;
    }

    return audio.play().then(() => audio.duration).catch(x => {console.log(x); return 0}) ;
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

    if (state.repeatType === RepeatType.TRACK) {
        return void play();
    }

    if (state.loading || isNaN(state.currentTrackIndex!)) {
        return;
    }
    const queueOrderIndex = (state.currentTrackIndex! + 1) % state.queueOrder.length;
    const queueIndex = state.queueOrder[queueOrderIndex!];

    clearInterval(intervalId);
    playTrackFacade(queueIndex, queueOrderIndex);
}

export default {
    pause: () => {
        audio.pause();
    }, play
}
