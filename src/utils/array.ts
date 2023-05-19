export const shuffleArray = (array: any[]) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const range = (stop: number, start: number = 0, step: number = 1) =>
    Array.from({ length: Math.ceil((stop - start) / step)}, (_, i) => start + (i * step))

