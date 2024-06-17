import { ContactEntity } from "./contact";

export interface PersonEntity {
    id: string;
    name: string;
    cpf: string;
    birthDate: string;
    contacts: ContactEntity[];
}
