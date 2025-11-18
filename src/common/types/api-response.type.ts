export type ApiResponse = {
    message: string;
    data?: Record<string, any> | Record<string, any>[];
}

type PaginationMeta = {
    totalDocs: number;
    skip: number;
    page: number;
    totalPages: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export type PaginationResponse<T> = {
    meta: PaginationMeta;
    docs: T[];
}