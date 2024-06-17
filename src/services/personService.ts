import { api } from "@/lib/api";
import { PersonEntity } from "@/entities/person";
import { TCreatePersonParams, TGetPersonsParams, TUpdatePersonParams } from "./personService.types";

export const getPersonById = async (personId: number): Promise<PersonEntity> => {
    try {
        const { data } = await api.get<PersonEntity>(`/person/id/${personId}`);

        return data;
    } catch (error) {
        console.error("Error on fetch person by id: ", error);
        throw error;
    }
};

export const getPersonByCPF = async (personCPF: number): Promise<PersonEntity> => {
    try {
        const { data } = await api.get<PersonEntity>(`/person/cpf/${personCPF}`);

        return data;
    } catch (error) {
        console.error("Error on fetch person by CPF: ", error);
        throw error;
    }
};

export const getPersons = async (params: TGetPersonsParams): Promise<PersonEntity[]> => {
    try {
        const { data } = await api.get<PersonEntity[]>("/person/all", {
            params,
        });

        return data;
    } catch (error) {
        console.error("Error on fetch persons: ", error);
        throw error;
    }
};

export const createPerson = async (params: TCreatePersonParams): Promise<PersonEntity> => {
    try {
        const { data } = await api.post<PersonEntity>("/person", {
            params,
        });

        return data;
    } catch (error) {
        console.error("Error on create person: ", error);
        throw error;
    }
};

export const updatePerson = async (params: TUpdatePersonParams): Promise<PersonEntity> => {
    try {
        const { data } = await api.put<PersonEntity>("/person", {
            params,
        });

        return data;
    } catch (error) {
        console.error("Error on update person: ", error);
        throw error;
    }
};

export const deletePerson = async (personId: number): Promise<void> => {
    try {
        await api.put<void>(`/person/${personId}`);
    } catch (error) {
        console.error("Error on delete person: ", error);
        throw error;
    }
};
