import { api } from "@/lib/api";
import { ContactEntity } from "@/entities/contact";
import { TCreateContactParams, TUpdateContactParams } from "./contactService.types";

export const createContact = async (params: TCreateContactParams): Promise<ContactEntity> => {
    try {
        const { data } = await api.post<ContactEntity>("/contact", params);

        return data;
    } catch (error) {
        console.error("Error on create contact: ", error);
        throw error;
    }
};

export const updateContact = async (params: TUpdateContactParams): Promise<ContactEntity> => {
    try {
        const { data } = await api.put<ContactEntity>("/contact", {
            params,
        });

        return data;
    } catch (error) {
        console.error("Error on update contact: ", error);
        throw error;
    }
};

export const deleteContact = async (contactId: number): Promise<void> => {
    try {
        await api.delete<void>(`/contact/${contactId}`);
    } catch (error) {
        console.error("Error on delete contact: ", error);
        throw error;
    }
};
