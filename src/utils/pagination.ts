export interface Pageable {
    page: number;
    size: number;
}

export const nextPageable = (pageable: Pageable): Pageable => ({
    page: pageable.page + 1,
    size: pageable.size,
});

export const prevPageable = (pageable: Pageable): Pageable | null => {
    if (pageable.page === 0) {
        return null;
    }

    return {
        page: pageable.page - 1,
        size: pageable.size,
    }
}

export interface Page<T> {
    content: T[];
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
}
