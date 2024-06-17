import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

import { getPersons } from "@/services/personService";
import type { TGetPersonsParams } from "@/services/personService.types";

import { NotFoundPersonCard } from "@/components/NotFoundPersonCard";
import { PersonCard } from "@/components/PersonCard";
import { PersonEntity } from "@/entities/person";
import { CreatePersonForm } from "@/components/CreatePersonForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [people, setPeople] = useState<PersonEntity[]>([]);
    const [isFetchingPeople, setIsFetchingPeople] = useState(false);

    const fetchPeople = async ({
        name = "",
        cpf,
        birthDateStr,
        page,
        perPage,
    }: TGetPersonsParams) => {
        setIsFetchingPeople(true);

        try {
            const { content } = await getPersons({
                name,
                cpf,
                birthDateStr,
                page,
                perPage,
            });

            setPeople(content);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingPeople(false);
        }
    };

    function addPersonIntoList(person: PersonEntity) {
        setPeople((state) => [...state, person]);
    }

    function removeFromPeopleList(peopleId: string) {
        setPeople((state) => state.filter((people) => people.id !== peopleId));
    }

    useEffect(() => {
        fetchPeople({});
    }, []);

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 ${inter.className}`}
        >
            {isFetchingPeople ? (
                <div>Carregando...</div>
            ) : (
                <div>
                    {!people.length ? (
                        <NotFoundPersonCard addPersonIntoList={addPersonIntoList} />
                    ) : (
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="flex flex-col gap-2">
                                <span className="font-semibold">Criação de nova pessoa</span>

                                <div className="mb-6 rounded-lg border px-8 py-6">
                                    <CreatePersonForm addPersonIntoList={addPersonIntoList} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="font-semibold">Lista de pessoas criadas</span>

                                {people.map((person) => (
                                    <PersonCard
                                        person={person}
                                        removeFromPeopleList={removeFromPeopleList}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
