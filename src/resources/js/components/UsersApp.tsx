import { useState } from "react"
import type { PaginatedResponse, Task, User } from "../types/api"
import { userListApi } from "../api/userListApi"
import { tasksListApi } from "../api/tasksListApi"
import { getErrorMessage } from "../utils/getErrorMessage"
import { Page } from "./Page"
import { UserTasks } from "./UserTasks"

type UsersAppProps = {
    userName: string
    initialUsers: PaginatedResponse<User>
}

export function UsersApp({ userName, initialUsers }: UsersAppProps) {
    const [list, setList] = useState<PaginatedResponse<User>>(initialUsers)
    const [selected, setSelected] = useState<User | null>(null)
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [error, setError] = useState("")

    const lastPage = Math.max(1, Math.ceil(list.total / list.limit))

    // Clicar num usuário: busca as tasks dele (handler explícito, sem useEffect)
    async function handleSelect(user: User) {
        setSelected(user)
        setTasks(null)
        setError("")

        try {
            const result = await tasksListApi(user.id, { page: 1, limit: 20 })
            setTasks(result.data)
        } catch (error) {
            setError(getErrorMessage(error, "Erro ao carregar as tasks"))
        }
    }

    // Paginação: carrega a página pedida e mantém o usuário escolhido
    async function handlePage(page: number) {
        if (page < 1) return
        if (page > lastPage) return

        const result = await userListApi({ page, limit: list.limit })
        setList(result)
    }

    return (
        <>
            <Page userName={userName} active="users">
                <div className="row g-4">
                    <section className="col-lg-6">
                        <h2 className="h5">Usuários ({list.total})</h2>

                        <ul className="list-group mb-3">
                            {list.data.map(user => {
                                const isSelected = user.id === selected?.id
                                const itemClass = isSelected ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"

                                return (
                                    <li key={user.id} className={itemClass} role="button" onClick={() => handleSelect(user)}>
                                        <strong>{user.name}</strong>
                                        <br />
                                        <small>{user.email} · {user.job_title ?? "sem cargo"}</small>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-outline-secondary btn-sm" disabled={list.page <= 1} onClick={() => handlePage(list.page - 1)}>
                                Anterior
                            </button>
                            <span className="small">Página {list.page} de {lastPage}</span>
                            <button className="btn btn-outline-secondary btn-sm" disabled={list.page >= lastPage} onClick={() => handlePage(list.page + 1)}>
                                Próxima
                            </button>
                        </div>
                    </section>

                    <section className="col-lg-6">
                        <UserTasks user={selected} tasks={tasks} error={error} />
                    </section>
                </div>
            </Page>
        </>
    )
}
