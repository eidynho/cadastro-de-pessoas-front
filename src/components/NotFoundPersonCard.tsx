import { PersonEntity } from "@/entities/person";
import { CreatePersonForm } from "./CreatePersonForm";

interface NotFoundPersonCardProps {
    addPersonIntoList: (person: PersonEntity) => void;
}

export function NotFoundPersonCard({ addPersonIntoList }: NotFoundPersonCardProps) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border px-8 py-6">
            <span>Nenhuma pessoa foi encontrada.</span>

            <span className="text-muted-foreground text-sm">
                Preencha o formulário abaixo para criar uma nova pessoa
            </span>

            <hr className="mt-4" />

            <div className="mt-4">
                <CreatePersonForm addPersonIntoList={addPersonIntoList} />
            </div>
        </div>
    );
}
