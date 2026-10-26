import type { Task, User } from "../types/api"

type UserTasksProps = {
    user: User | null
    tasks: Task[] | null
    error: string
}

export function UserTasks({ user, tasks, error }: UserTasksProps) {
    if (user === null) {
        return <p className="text-muted">Escolha um usuário para ver as tasks dele.</p>
    }

    if (error !== "") {
        return <div className="alert alert-danger">{error}</div>
    }

    if (tasks === null) {
        return <p className="text-muted">Carregando as tasks de {user.name}...</p>
    }

    return (
        <>
            <h2 className="h5">Tasks de {user.name}</h2>

            {tasks.length === 0 && <p className="text-muted">Nenhuma task.</p>}

            <ul className="list-group">
                {tasks.map(task => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between">
                        <span>{task.name}</span>
                        <span className={task.is_done ? "badge text-bg-success" : "badge text-bg-secondary"}>
                            {task.is_done ? "feita" : "pendente"}
                        </span>
                    </li>
                ))}
            </ul>
        </>
    )
}
