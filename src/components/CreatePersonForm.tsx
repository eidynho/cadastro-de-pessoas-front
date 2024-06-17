import { useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { createPerson } from "@/services/personService";
import type { TCreatePersonParams } from "@/services/personService.types";

const labelClasses = "block text-sm font-medium";
const inputClasses =
    "mt-1 w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring";

export function CreatePersonForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TCreatePersonParams>();

    const onSubmit = async (data: TCreatePersonParams) => {
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            await createPerson(data as TCreatePersonParams);
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError && error?.response?.data) {
                setSubmissionError(error.response.data);
            } else {
                setSubmissionError("Erro ao criar uma pessoa.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg rounded-lg">
            <h2 className="font-semibold">Criar pessoa</h2>

            <div className="mb-4">
                <span className="text-muted-foreground text-sm">
                    Campos que possuem * são obrigatórios.
                </span>
            </div>

            {submissionError && <p className="mb-4 text-red-500">{submissionError}</p>}

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
                <label htmlFor="cpf" className={labelClasses}>
                    CPF*
                </label>

                <input
                    id="cpf"
                    {...register("cpf", { required: "CPF é obrigatório" })}
                    className={inputClasses}
                />

                {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="birthDate" className={labelClasses}>
                    Data de aniversário*
                </label>

                <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate", { required: "A data de aniversário é obrigatória" })}
                    className={inputClasses}
                />

                {errors.birthDate && (
                    <span className="text-xs text-red-500">{errors.birthDate.message}</span>
                )}
            </div>

            <hr className="mb-4 mt-6" />

            <div className="mb-4">
                <span className="block font-medium">A pessoa deve ter no mínimo um contato.</span>
                <span className="text-muted-foreground block text-sm">
                    Insira os dados do contato abaixo.
                </span>
            </div>

            <div className="mb-4">
                <label htmlFor="contactName" className={labelClasses}>
                    Nome do contato*
                </label>

                <input
                    id="contactName"
                    {...register("contactName", { required: "Nome do contato é obrigatório" })}
                    className={inputClasses}
                />

                {errors.contactName && (
                    <span className="text-xs text-red-500">{errors.contactName.message}</span>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="contactPhone" className={labelClasses}>
                    Telefone do contato*
                </label>

                <input
                    id="contactPhone"
                    {...register("contactPhone", { required: "Telefone do contato é obrigatório" })}
                    className={inputClasses}
                />

                {errors.contactPhone && (
                    <span className="text-xs text-red-500">{errors.contactPhone.message}</span>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="contactEmail" className={labelClasses}>
                    E-mail do contato*
                </label>

                <input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail", { required: "E-mail do contato é obrigatório" })}
                    className={inputClasses}
                />

                {errors.contactEmail && (
                    <span className="text-xs text-red-500">{errors.contactEmail.message}</span>
                )}
            </div>

            <button
                type="submit"
                className="w-full rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Criando pessoa..." : "Criar pessoa"}
            </button>
        </form>
    );
}
