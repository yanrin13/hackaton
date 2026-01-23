import { createPortal } from 'react-dom'
import { toast, Flip } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';


export default function RequestModal({ onClose }) {

    const modalRoot = document.getElementById("modal-request");
    const [district, setDistrict] = useState('');
    const [problem, setProblem] = useState('');
    const [description, setDescription] = useState('');

    const backgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    const sendRequest = async () => {
        const newRequest = [
            {
                source: "Город решений",
                district: district,
                category: problem,
                subcategory: description,
                status: "Новое",
                description: `Обращение по теме: ${description}`,
                admin_status: true,
            }
        ]

        const res = await fetch("/api/statement", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRequest),
        });

        if (!res.ok) throw new Error("Ошибка отправки");
    };


    const notify = () => toast.success(<span style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)' }}>
        Успешно отправлено! Спасибо
    </span>, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
    });

    const CheckAllInputs = () => {
        if (district === '' || problem === '' || description === '') {
            return false
        }
        return true
    }

    return createPortal((<div className='overlay' onMouseDown={backgroundClick}>
        <div className='modal-window'>
            <form onSubmit={async (e) => {
                e.preventDefault();
                if (!CheckAllInputs()) return;

                try {
                    await sendRequest();
                    onClose();
                    notify();
                } catch {
                    toast.error("Не удалось отправить заявку");
                }
            }}>
                <p>Район проблемы:</p>
                <select className='modal-window__selection' value={district} onChange={e => setDistrict(e.target.value)}>
                    <option value="">Выберите район</option>
                    <option value="Адмиралтейский">Адмиралтейский</option>
                    <option value="Василеостровский">Василеостровский</option>
                    <option value="Выборгский">Выборгский</option>
                    <option value="Калининский">Калининский</option>
                    <option value="Кировский">Кировский</option>
                    <option value="Колпинский">Колпинский</option>
                    <option value="Красногвардейский">Красногвардейский</option>
                    <option value="Красносельский">Красносельский</option>
                    <option value="Кронштадтский">Кронштадтский</option>
                    <option value="Курортный">Курортный</option>
                    <option value="Московский">Московский</option>
                    <option value="Невский">Невский</option>
                    <option value="Петроградский">Петроградский</option>
                    <option value="Петродворцовый">Петродворцовый</option>
                    <option value="Приморский">Приморский</option>
                    <option value="Пушкинский">Пушкинский</option>
                    <option value="Фрунзенский">Фрунзенский</option>
                    <option value="Центральный">Центральный</option>
                </select>

                <p>Категория проблемы:</p>
                <select className='modal-window__selection' value={problem} onChange={e => setProblem(e.target.value)}>
                    <option value="">Выберите вид проблемы</option>
                    <option value="Парковки">Парковки</option>
                    <option value="Транспорт">Транспорт</option>
                    <option value="Освещение">Освещение</option>
                    <option value="ЖКХ">ЖКХ</option>
                    <option value="Благоустройство">Благоустройство</option>
                    <option value="Мусор">Мусор</option>
                    <option value="Шум">Шум</option>
                </select>

                <p>Дополнительное описание:</p>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <button className='sign-btn' type='submit'>Отправить</button>
                </div>
            </form>
        </div>

    </div >), modalRoot)

}