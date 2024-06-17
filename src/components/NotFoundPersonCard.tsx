import { CreatePersonForm } from "./CreatePersonForm";

export function NotFoundPersonCard() {
    return (
        <div className="flex flex-col gap-1 rounded-lg border px-8 py-6">
            <span>Nenhuma pessoa foi encontrada.</span>

            <span className="text-muted-foreground text-sm">
                Preencha o formulário abaixo para criar uma nova pessoa
            </span>

            <hr className="mt-4" />

            <div className="mt-4">
                <CreatePersonForm />
            </div>
        </div>
    );
}
