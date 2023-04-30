import {StreamableTrack, Track} from "../../models/track";
import {Artist, SimpleArtist} from "../../models/artist";


const playlistImageUrl = "https://upload.wikimedia.org/wikipedia/ru/7/72/%D0%94%D0%BE%D0%BC_%D1%81_%D0%BD%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC%D0%B8_%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8.jpg";

const artistScripi: SimpleArtist = {
    id: 1,
    name: "Скриптонит"
};

const artistYura: SimpleArtist = {
    id: 2,
    name: "104"
};

const artistTruwer: SimpleArtist = {
    id: 3,
    name: "Truwer"
};

const artistAtl: SimpleArtist = {
    id: 4,
    name: "ATL"
};

export const data: Track[] = [
    {
        id: 1,
        name: "Интро",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 78
    },
    {
        id: 2,
        name: "Дома",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 213
    },
    {
        id: 3,
        name: "Оставь это нам",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 100
    },
    {
        id: 4,
        name: "Вниз",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 225
    },
    {
        id: 5,
        name: "Коньяк",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 142
    },
    {
        id: 6,
        name: "Океан",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 218
    },
    {
        id: 7,
        name: "Притон",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 236
    },
    {
        id: 8,
        name: "Танцуй сама",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 277
    },
    {
        id: 9,
        name: "На должном",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 205
    },
    {
        id: 10,
        name: "Сука тащит нас на дно",
        imageUrl: playlistImageUrl,
        artists: [artistScripi, artistYura, artistTruwer],
        albumId: 1,
        duration: 411
    },
    {
        id: 11,
        name: "Сны",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 240
    },
    {
        id: 12,
        name: "100 поцелуев",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 155
    },
    {
        id: 13,
        name: "Бумажки",
        imageUrl: playlistImageUrl,
        artists: [artistScripi, artistYura],
        albumId: 1,
        duration: 100
    },
    {
        id: 14,
        name: "Лям",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 276
    },
    {
        id: 15,
        name: "Стиль (другая версия)",
        imageUrl: playlistImageUrl,
        artists: [artistScripi, artistAtl],
        albumId: 1,
        duration: 407
    },
    {
        id: 16,
        name: "Я не улыбаюсь",
        imageUrl: playlistImageUrl,
        artists: [artistScripi, artistYura],
        albumId: 1,
        duration: 280
    },
    {
        id: 17,
        name: "Вечеринка",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 363
    },
    {
        id: 18,
        name: "Это любовь",
        imageUrl: playlistImageUrl,
        artists: [artistScripi],
        albumId: 1,
        duration: 279
    },
]

export const streamableData: StreamableTrack[] = [
    {
        ...data[0],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%98%D0%BD%D1%82%D1%80%D0%BE%20(256%20kbps).mp3?alt=media&token=919ed925-91fc-449f-acc1-2e69d450cfeb"
    },
    {
        ...data[1],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%94%D0%BE%D0%BC%D0%B0%20(128%20kbps).mp3?alt=media&token=55f75e98-22d3-4cd0-bece-7138f8420da6",
    },
    {
        ...data[2],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%9E%D1%81%D1%82%D0%B0%D0%B2%D1%8C%20%D1%8D%D1%82%D0%BE%20%D0%BD%D0%B0%D0%BC%20(128%20kbps).mp3?alt=media&token=6a46a5da-c808-48e0-a1ae-02c4a0610518"
    },
    {
        ...data[3],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%92%D0%BD%D0%B8%D0%B7%20(128%20kbps).mp3?alt=media&token=ae246479-ca10-4c00-8221-3773dd32f952",
    },
    {
        ...data[4],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%9A%D0%BE%D0%BD%D1%8C%D1%8F%D0%BA%20(128%20kbps).mp3?alt=media&token=d5d3d9bc-29e5-4031-b93c-fa8189727488"
    },
    {
        ...data[5],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%9E%D0%BA%D0%B5%D0%B0%D0%BD%20(128%20kbps).mp3?alt=media&token=d1efba2b-911f-4455-8b6f-ff57f325ff68"
    },
    {
        ...data[6],
        url: "SnapInsta.io - Скриптонит - Притон (128 kbps).mp3"
    },
    {
        ...data[7],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%A2%D0%B0%D0%BD%D1%86%D1%83%D0%B8%CC%86%20%D1%81%D0%B0%D0%BC%D0%B0%20(128%20kbps).mp3?alt=media&token=dc01c641-f440-4b30-bcbf-8b938a8d316f"
    },
    {
        ...data[8],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%9D%D0%B0%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D0%BC%20(128%20kbps).mp3?alt=media&token=3ad9e680-c4df-4b21-999d-f5811a8f5305"
    },
    {
        ...data[9],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%A1%D1%83%D0%BA%D0%B0%20%D1%82%D0%B0%D1%89%D0%B8%D1%82%20%D0%BD%D0%B0%D1%81%20%D0%BD%D0%B0%20%D0%B4%D0%BD%D0%BE%20(%D0%BF%D1%80%D0%B8%20%D1%83%D1%87.%20%D0%AE%D1%80%D0%B8%D0%BA%20%D0%A7%D0%B5%D1%82%D0%B2%D0%B5%D1%80%D0%B3%2C%20Truwer)%20(128%20kbps).mp3?alt=media&token=d16b845d-5471-4a81-a2e2-0ab527aca4b5"
    },
    {
        ...data[10],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%A1%D0%BD%D1%8B%20(128%20kbps).mp3?alt=media&token=42db51a7-f832-4044-b2a3-54343f65fb1a"
    },
    {
        ...data[11],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20100%20%D0%BF%D0%BE%D1%86%D0%B5%D0%BB%D1%83%D0%B5%D0%B2%20(128%20kbps).mp3?alt=media&token=32268901-ffc9-4944-b31f-637d00cb6b24"
    },
    {
        ...data[12],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%91%D1%83%D0%BC%D0%B0%D0%B6%D0%BA%D0%B8%20(%D0%BF%D1%80%D0%B8%20%D1%83%D1%87.%20%D0%AE%D1%80%D0%B8%D0%BA%20%D0%A7%D0%B5%D1%82%D0%B2%D0%B5%D1%80%D0%B3)%20(128%20kbps).mp3?alt=media&token=e45db165-b62b-4570-8d15-846bc0e9d724"
    },
    {
        ...data[13],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%9B%D1%8F%D0%BC%20(128%20kbps).mp3?alt=media&token=2db3e529-7109-43f2-9b19-7cd61dff2d3b"
    },
    {
        ...data[14],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%A1%D1%82%D0%B8%D0%BB%D1%8C%20(%D0%B4%D1%80%D1%83%D0%B3%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F)%20(%D0%BF%D1%80%D0%B8%20%D1%83%D1%87.%20ATL)%20(128%20kbps).mp3?alt=media&token=28131b5d-7a0a-4e24-a485-e5d282fc1e1e"
    },
    {
        ...data[15],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%AF%20%D0%BD%D0%B5%20%D1%83%D0%BB%D1%8B%D0%B1%D0%B0%D1%8E%D1%81%D1%8C%20(%D0%BF%D1%80%D0%B8%20%D1%83%D1%87.%20%D0%AE%D1%80%D0%B8%D0%BA%20%D0%A7%D0%B5%D1%82%D0%B2%D0%B5%D1%80%D0%B3)%20(128%20kbps).mp3?alt=media&token=c574dd30-7f10-4bb4-b701-cd2665e5a897"
    },
    {
        ...data[16],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%92%D0%B5%D1%87%D0%B5%D1%80%D0%B8%D0%BD%D0%BA%D0%B0%20(128%20kbps).mp3?alt=media&token=2f33be25-c6ac-465d-8df4-3823555bcc1a"
    },
    {
        ...data[17],
        url: "https://firebasestorage.googleapis.com/v0/b/todo-c3cdf.appspot.com/o/SnapInsta.io%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%BD%D0%B8%D1%82%20-%20%D0%AD%D1%82%D0%BE%20%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D1%8C%20(128%20kbps).mp3?alt=media&token=295f2228-6567-48b7-ad35-c5189a43317d"
    }
]
