export interface SimpleArtist {
    id: number;
    name: string;
    imageUrl: string;
}

export interface Artist extends SimpleArtist {
    imageUrl: string;
    description: string;
}
