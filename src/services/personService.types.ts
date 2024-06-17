export interface TGetPersonsParams {
    name?: string;
    cpf?: string;
    birthDateStr?: string;
    page?: number;
    perPage?: number;
}

export interface TGetPersonsOutput {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    content: [];
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    empty: boolean;
}

export interface TCreatePersonParams {
    name: string;
    cpf: string;
    birthDate: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
}

export interface TUpdatePersonParams {
    id: string;
    name: string;
    cpf: string;
    birthDate: string;
}
