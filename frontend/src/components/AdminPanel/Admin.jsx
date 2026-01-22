import { useState } from "react";


export default function Admin() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Заявка #1", description: "Описание задачи 1" },
        { id: 2, title: "Заявка #2", description: "Описание задачи 2" },
        { id: 3, title: "Заявка #3", description: "Описание задачи 3" },
    ]);

    const handleAccept = (id) => {
        alert(`Принято: задача ${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleReject = (id) => {
        alert(`Отклонено: задача ${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                alert(`Импортировано ${json.length || 0} задач`);
            } catch (err) {
                alert("Ошибка при чтении JSON");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="task-panel">
            <div className="task-panel__header">
                <h2>Панель задач</h2>
                <label className="task-panel__import">
                    Импорт JSON
                    <input type="file" accept=".json" onChange={handleImport} />
                </label>
            </div>

            <div className="task-panel__list">
                {tasks.length === 0 && <p className="task-panel__empty">Нет заявок</p>}
                {tasks.map((task) => (
                    <div className="task-panel__task" key={task.id}>
                        <div className="task-panel__info">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                        <div className="task-panel__actions">
                            <button
                                className="task-panel__accept"
                                onClick={() => handleAccept(task.id)}
                            >

                            </button>
                            <button
                                className="task-panel__reject"
                                onClick={() => handleReject(task.id)}
                            >

                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

