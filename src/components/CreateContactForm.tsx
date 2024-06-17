import { useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { ContactEntity } from "@/entities/contact";
import { createContact } from "@/services/contactService";
import type { TCreateContactParams } from "@/services/contactService.types";

const labelClasses = "block text-sm font-medium";
const inputClasses =
    "mt-1 w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring";

interface CreateContactFormProps {
    personId: string;
    addContactIntoList: (personId: string, contact: ContactEntity) => void;
}

export function CreateContactForm({ personId, addContactIntoList }: CreateContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TCreateContactParams>();

    const onSubmit = async (data: TCreateContactParams) => {
        setIsSubmitting(true);
        setSubmissionSuccess(null);
        setSubmissionError(null);

        try {
            const createdContact = await createContact({
                ...data,
                personId,
            } as TCreateContactParams);

            addContactIntoList(personId, createdContact);
            setSubmissionSuccess("Contato criado com sucesso.");
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao criar um contato.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg rounded-lg">
            <div className="mb-4">
                <span className="block font-medium">Criar novo contato</span>
                <span className="text-muted-foreground block text-sm">
                    Insira os dados do contato abaixo.
                </span>
            </div>

            {submissionSuccess && (
                <p className="mb-4 rounded-lg border border-green-500 bg-green-500/5 px-2 py-2 text-green-500">
                    {submissionSuccess}
                </p>
            )}
            {submissionError && (
                <p className="mb-4 rounded-lg border border-red-500 bg-red-500/5 px-2 py-2 text-red-500">
                    {submissionError}
                </p>
            )}

            <div className="mb-4">
                <label htmlFor="name" className={labelClasses}>
                    Nome*
                </label>

                <input
                    id="name"
                    {...register("name", { required: "O nome é obrigatório" })}
                    className={inputClasses}
                />

                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="phone" className={labelClasses}>
                    Telefone do contato*
                </label>

                <input
                    id="phone"
                    {...register("phone", { required: "Telefone do contato é obrigatório" })}
                    className={inputClasses}
                />

                {errors.phone && (
                    <span className="text-xs text-red-500">{errors.phone.message}</span>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className={labelClasses}>
                    E-mail do contato*
                </label>

                <input
                    id="email"
                    type="email"
                    {...register("email", { required: "E-mail do contato é obrigatório" })}
                    className={inputClasses}
                />

                {errors.email && (
                    <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
            </div>

            <button
                type="submit"
                className="w-full rounded bg-blue-500 p-1 text-white transition duration-200 hover:bg-blue-600"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Criando contato..." : "Criar contato"}
            </button>
        </form>
    );
}
