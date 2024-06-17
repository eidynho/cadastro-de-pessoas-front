import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

import { getPersons } from "@/services/personService";
import type { TGetPersonsParams } from "@/services/personService.types";

import { PersonCard } from "@/components/PersonCard";
import { PersonEntity } from "@/entities/person";
import { CreatePersonForm } from "@/components/CreatePersonForm";
import { ContactEntity } from "@/entities/contact";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [page, setPage] = useState(0);
    const [paginationData, setPaginationData] = useState({ totalElements: 0, totalPages: 0 });
    const [people, setPeople] = useState<PersonEntity[]>([]);
    const [isFetchingPeople, setIsFetchingPeople] = useState(false);

    const fetchPeople = async ({
        name = "",
        cpf,
        birthDateStr,
        page,
        perPage = 3,
    }: TGetPersonsParams) => {
        setIsFetchingPeople(true);

        try {
            const { content, totalElements, totalPages } = await getPersons({
                name,
                cpf,
                birthDateStr,
                page,
                perPage,
            });

            setPeople(content);
            setPaginationData({ totalElements, totalPages });
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

    function addContactIntoList(personId: string, contact: ContactEntity) {
        setPeople((state) => {
            const personContact = state.find((person) => person.id === personId);
            if (!personContact) return state;

            personContact.contacts.push(contact);

            return state;
        });
    }

    function removeFromContactList(personId: string, contactId: string) {
        setPeople((state) => {
            const personContact = state.find((person) => person.id === personId);
            if (!personContact) return state;

            personContact.contacts = personContact.contacts.filter(
                (contact) => contact.id === contactId,
            );

            return state;
        });
    }

    useEffect(() => {
        fetchPeople({ page });
    }, [page]);

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 ${inter.className}`}
        >
            {isFetchingPeople ? (
                <div>Carregando...</div>
            ) : (
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Criação de nova pessoa</span>

                        <div className="mb-6 rounded-lg border px-8 py-6">
                            <CreatePersonForm addPersonIntoList={addPersonIntoList} />
                        </div>
                    </div>

                    <div>
                        <span className="font-semibold">
                            Lista de pessoas criadas ({paginationData.totalElements})
                        </span>

                        <div className="mt-2 flex max-h-[650px] flex-col gap-2 overflow-auto">
                            {!people.length ? (
                                <div className="flex flex-col gap-2">
                                    <div className="mx-auto w-full max-w-lg rounded-lg border px-6 py-4">
                                        Nenhuma pessoa encontrada.
                                    </div>
                                </div>
                            ) : (
                                people.map((person) => (
                                    <PersonCard
                                        key={person.id}
                                        person={person}
                                        removeFromPeopleList={removeFromPeopleList}
                                        addContactIntoList={addContactIntoList}
                                        removeFromContactList={removeFromContactList}
                                    />
                                ))
                            )}
                        </div>

                        {!!people.length && (
                            <div className="flex flex-col">
                                <div className="mt-4 flex gap-2">
                                    <button
                                        className="w-1/2 rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600 disabled:bg-gray-400"
                                        onClick={() => setPage((state) => state - 1)}
                                        disabled={page === 0}
                                    >
                                        Anterior
                                    </button>

                                    <button
                                        className="w-1/2 rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600 disabled:bg-gray-400"
                                        onClick={() => setPage((state) => state + 1)}
                                        disabled={paginationData.totalPages - 1 <= page}
                                    >
                                        Próxima
                                    </button>
                                </div>

                                <div className="mt-2 text-center font-medium">
                                    Pessoas por página: 3 / Página {page + 1} de{" "}
                                    {paginationData.totalPages}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
