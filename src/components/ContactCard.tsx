import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { ContactEntity } from "@/entities/contact";
import { deleteContact, updateContact } from "@/services/contactService";
import type { TUpdateContactParams } from "@/services/contactService.types";

const labelClasses = "block text-sm font-medium";
const inputClasses =
    "mt-1 w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring";

interface ContactCardProps {
    personId: string;
    contact: ContactEntity;
    removeFromContactList: (personId: string, contactId: string) => void;
}

export function ContactCard({ personId, contact, removeFromContactList }: ContactCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TUpdateContactParams>();

    const onSubmitUpdateContact = async (data: TUpdateContactParams) => {
        setIsSubmitting(true);
        setSubmissionSuccess(null);
        setSubmissionError(null);

        try {
            await updateContact({
                ...data,
                contactId: contact.id,
            } as TUpdateContactParams);

            setSubmissionSuccess("O contato foi editado com sucesso.");
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao editar o contato.");
            }
        } finally {
            setIsSubmitting(false);
            setIsEditing(false);
        }
    };

    const deleteContactMethod = async () => {
        setIsDeleting(true);

        try {
            await deleteContact(contact.id);
            setSubmissionSuccess("O contato foi deletado com sucesso.");

            removeFromContactList(personId, contact.id);
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao deletar o contato.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        setValue("name", contact.name);
        setValue("phone", contact.phone);
        setValue("email", contact.email);
    }, [contact, setValue]);

    useEffect(() => {
        setSubmissionError(null);
    }, [isEditing]);

    return (
        <div className="mx-auto py-2 lg:px-10">
            <form onSubmit={handleSubmit(onSubmitUpdateContact)}>
                <h2 className="mb-4 font-semibold">
                    {isEditing ? "Editar contato" : `Contato ID: ${contact.id}`}
                </h2>

                {isEditing && submissionSuccess && (
                    <p className="mb-4 rounded-lg border border-green-500 bg-green-500/5 px-2 py-2 text-green-500">
                        {submissionSuccess}
                    </p>
                )}

                {submissionError && (
                    <p className="mb-4 rounded-lg border border-red-500 bg-red-500/5 px-2 py-2 text-red-500">
                        {submissionError}
                    </p>
                )}

                <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="mb-4">
                        <label htmlFor="name" className={labelClasses}>
                            Nome do contato
                        </label>

                        <input
                            id="name"
                            {...register("name", {
                                required: "Nome do contato é obrigatório",
                            })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className={labelClasses}>
                            Telefone do contato
                        </label>

                        <input
                            id="phone"
                            {...register("phone", {
                                required: "Telefone do contato é obrigatório",
                            })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.phone && (
                            <span className="text-xs text-red-500">{errors.phone.message}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className={labelClasses}>
                            E-mail do contato
                        </label>

                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "E-mail do contato é obrigatório",
                            })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.email && (
                            <span className="text-xs text-red-500">{errors.email.message}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 p-1 text-white transition duration-200 hover:bg-blue-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </button>
                )}

                <div className="flex gap-2">
                    <button
                        type="button"
                        className={`mt-2 w-1/2 rounded p-1 text-white transition duration-200 ${!isEditing ? "bg-cyan-500 hover:bg-cyan-600" : "bg-gray-500 hover:bg-gray-600"}`}
                        onClick={() => setIsEditing((state) => !state)}
                    >
                        {isEditing ? "Cancelar edição" : "Editar contato"}
                    </button>

                    <button
                        type="button"
                        className="mt-2 w-1/2 rounded bg-pink-800 p-1 text-white transition duration-200 hover:bg-pink-900"
                        onClick={deleteContactMethod}
                    >
                        {isDeleting ? "Deletando..." : "Deletar contato"}
                    </button>
                </div>
            </form>
        </div>
    );
}
