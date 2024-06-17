import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { PersonEntity } from "@/entities/person";
import { deletePerson, updatePerson } from "@/services/personService";
import type { TUpdatePersonParams } from "@/services/personService.types";
import { ContactCard } from "./ContactCard";
import { ContactEntity } from "@/entities/contact";
import { CreateContactForm } from "./CreateContactForm";

const labelClasses = "block text-sm font-medium";
const inputClasses =
    "mt-1 w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring";

interface PersonCardProps {
    person: PersonEntity;
    removeFromPeopleList: (personId: string) => void;
    addContactIntoList: (personId: string, contact: ContactEntity) => void;
    removeFromContactList: (personId: string, contactId: string) => void;
}

export function PersonCard({
    person,
    removeFromPeopleList,
    addContactIntoList,
    removeFromContactList,
}: PersonCardProps) {
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
    } = useForm<TUpdatePersonParams>();

    const onSubmitUpdatePerson = async (data: TUpdatePersonParams) => {
        setIsSubmitting(true);
        setSubmissionSuccess(null);
        setSubmissionError(null);

        try {
            await updatePerson({ ...data, id: person.id } as TUpdatePersonParams);
            setSubmissionSuccess("A pessoa foi editada com sucesso.");
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao editar a pessoa.");
            }
        } finally {
            setIsSubmitting(false);
            setIsEditing(false);
        }
    };

    const deletePersonMethod = async () => {
        setIsDeleting(true);

        try {
            await deletePerson(person.id);
            setSubmissionSuccess("A pessoa foi deletada com sucesso.");

            removeFromPeopleList(person.id);
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao deletar a pessoa.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        setValue("name", person.name);
        setValue("cpf", person.cpf);
        setValue("birthDate", person.birthDate);
    }, [person, setValue]);

    useEffect(() => {
        setSubmissionError(null);
    }, [isEditing]);

    return (
        <div className="mx-auto max-w-2xl rounded-lg border px-8 py-6">
            <form onSubmit={handleSubmit(onSubmitUpdatePerson)}>
                <h2 className="mb-4 font-semibold">
                    {isEditing ? "Editar pessoa" : `Pessoa ID: ${person.id}`}
                </h2>

                {isEditing && submissionSuccess && (
                    <p className="mb-4 rounded-lg border border-green-500 bg-green-500/5 px-2 py-2 text-green-500">
                        {submissionSuccess}
                    </p>
                )}
                {isEditing && submissionError && (
                    <p className="mb-4 rounded-lg border border-red-500 bg-red-500/5 px-2 py-2 text-red-500">
                        {submissionError}
                    </p>
                )}

                <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="mb-4">
                        <label htmlFor="name" className={labelClasses}>
                            Nome
                        </label>

                        <input
                            id="name"
                            {...register("name", { required: "O nome é obrigatório" })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cpf" className={labelClasses}>
                            CPF
                        </label>

                        <input
                            id="cpf"
                            {...register("cpf", { required: "CPF é obrigatório" })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.cpf && (
                            <span className="text-xs text-red-500">{errors.cpf.message}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className={labelClasses}>
                            Data de aniversário
                        </label>

                        <input
                            id="birthDate"
                            type="date"
                            {...register("birthDate", {
                                required: "A data de aniversário é obrigatória",
                            })}
                            className={inputClasses}
                            disabled={!isEditing}
                        />

                        {errors.birthDate && (
                            <span className="text-xs text-red-500">{errors.birthDate.message}</span>
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
                        className={`mt-2 w-1/2 rounded p-1 text-white transition duration-200 ${!isEditing ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
                        onClick={() => setIsEditing((state) => !state)}
                    >
                        {isEditing ? "Cancelar edição" : "Editar pessoa"}
                    </button>

                    <button
                        type="button"
                        className="mt-2 w-1/2 rounded bg-red-800 p-1 text-white transition duration-200 hover:bg-red-900"
                        onClick={deletePersonMethod}
                    >
                        {isDeleting ? "Deletando..." : "Deletar pessoa"}
                    </button>
                </div>
            </form>

            <hr className="my-4" />

            <span className="mt-2 block font-medium">Lista de contatos</span>
            <span className="mb-1 block text-sm text-muted-foreground">
                A pessoa precisa ter no mínimo um contato.
            </span>

            {person.contacts.map((contact) => (
                <Fragment key={contact.id}>
                    <ContactCard
                        personId={person.id}
                        contact={contact}
                        removeFromContactList={removeFromContactList}
                    />

                    <hr className="my-2" />
                </Fragment>
            ))}

            <CreateContactForm personId={person.id} addContactIntoList={addContactIntoList} />
        </div>
    );
}
