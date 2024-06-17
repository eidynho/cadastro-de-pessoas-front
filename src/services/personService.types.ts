export interface TGetPersonsParams {
    name?: string;
    cpf?: string;
    birthDateStr?: string;
    page?: number;
    perPage?: number;
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
