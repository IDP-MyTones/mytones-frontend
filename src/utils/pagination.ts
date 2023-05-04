import {Observable, of} from "rxjs";

export enum Direction {
    ASC = 'ASC',
    DESC = 'DESC'
}

// export interface Sort {
//     direction: Direction;
// }

export interface Pageable {
    page: number;
    size: number;
    offset: number;
    // sort: Sort;
}

export const nextPageable = (pageable: Pageable): Pageable => ({
    page: pageable.page + 1,
    size: pageable.size,
    offset: pageable.size * (pageable.page + 1),
    // sort: pageable.sort,
});

export const prevPageable = (pageable: Pageable): Pageable | null => {
    if (pageable.page === 0) {
        return null;
    }

    return {
        page: pageable.page - 1,
        size: pageable.size,
        offset: pageable.size * (pageable.page - 1)
    }
}

export interface Page<T> {
    content: T[];
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
}

export type Fetcher<T> = (p: Pageable) => Observable<Page<T>>;

export class Paginator<T> {

    public constructor(private readonly fetcher: Fetcher<T>,
                       private pageable: Pageable = {page: 0, size: 0, offset: 0}) {
    }

    public next(): Observable<Page<T>> {
        this.pageable = nextPageable(this.pageable);
        return this.fetch(this.pageable);
    }

    public prev(): Observable<Page<T>> {
        if (this.pageable.page === 0) {
            return of({ content: [], number: -1, size: -1, totalPages: -1, totalElements: -1 });
        }
        this.pageable = prevPageable(this.pageable)!;
        return this.fetch(this.pageable);
    }

    public fetch(pageable: Pageable): Observable<Page<T>> {
        return this.fetcher(pageable);
    }

}
