import { PersonEntity } from "./person";

export interface ContactEntity {
    id: string;
    name: string;
    phone: string;
    email: string;
    person?: PersonEntity;
}
