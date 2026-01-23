import { useState, useEffect } from "react";
import check from '../../assets/check.svg'
import cross from '../../assets/cross.svg'
import LoginModal from '../Modal/LoginModal'

export default function Admin() {
    const [showReg, setShowReg] = useState(false)

    const [tasks, setTasks] = useState([])
    useEffect(() => {
        fetch('api/statement')
            .then(r => {
                if (r.status > 200) {
                    setShowReg(true)
                }
            })
            .then(r => r.json())
            .then(setTasks)
            .catch(console.error)
    }, [])
    async function handleAccept(task) {
            try {
                const response = await fetch(`/api/statement/${task.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    id: task.id,
                    source: task.source,
                    district: task.district,
                    category: task.category,
                    subcategory: task.subcategory,
                    created_at: task.created_at,
                    status: task.status,
                    description: task.description,
                    status_admin: false,
                }]),
            });

            if (!response.ok) {
            throw new Error('Ошибка обновления');
            }

            const data = await response.json();
            console.log('Обновлено:', data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleReject(id) {
        await fetch(`/api/statement/${id}`, {
            method: "DELETE",
        })
    }
    
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
                <h2>Заявки для рассмотрения</h2>
                <label className="task-panel__import">
                    Импорт JSON
                    <input type="file" accept=".json" onChange={handleImport} />
                </label>
            </div>
            {showReg && <LoginModal onClose={() => setShowReg(false)}/>}
            <div className="task-panel__list">
                {(!tasks || tasks.length === 0) ? (
                    <p className="task-panel__empty">Нет заявок</p>
                ) : (
                    tasks.map((task) => (
                        
                        <div className="task-panel__task" key={task.id}>
                            <div className="task-panel__info">
                                <h3 className="task-panel__title">{`${task.category} | ${task.district}`}</h3>
                                <p>{task.description}</p>
                                <p>{task.subcategory}</p>
                                <p>{task.created_at}</p>
                            </div>
                            <div className="task-panel__actions">
                                <button
                                    className="task-panel__accept"
                                    onClick={async() => {
                                        await handleAccept(task)
                                        location.reload();
                                    }}
                                >
                                    <img src={check} alt="принять" />
                                </button>
                                <button
                                    className="task-panel__reject"
                                    onClick={async () => {
                                        await handleReject(task.id);
                                        location.reload();
                                    }}
                                >
                                    <img src={cross} alt="отклонить" />
                                </button>
                            </div>
                        </div>
                    ))
                )}


                
            </div>
        </div>
    );
}

