export interface TCreateContactParams {
    personId: string;
    name: string;
    phone: string;
    email: string;
}

export interface TUpdateContactParams {
    contactId: string;
    name: string;
    phone: string;
    email: string;
}
