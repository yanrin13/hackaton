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
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!CheckAllInputs()) return

                onClose()
                notify()
            }}>
                <p>Район проблемы:</p>
                <select className='modal-window__selection' value={district} onChange={e => setDistrict(e.target.value)}>
                    <option value="">Выберите район</option>
                    <option value="admiralteysky">Адмиралтейский</option>
                    <option value="vasileostrovsky">Василеостровский</option>
                    <option value="vyborgsky">Выборгский</option>
                    <option value="kalininsky">Калининский</option>
                    <option value="kirovsky">Кировский</option>
                    <option value="kolpinsky">Колпинский</option>
                    <option value="krasnogvardeysky">Красногвардейский</option>
                    <option value="krasnoselsky">Красносельский</option>
                    <option value="kronshtadtsky">Кронштадтский</option>
                    <option value="kurortny">Курортный</option>
                    <option value="moskovsky">Московский</option>
                    <option value="nevsky">Невский</option>
                    <option value="petrogradsky">Петроградский</option>
                    <option value="petrodvortsovy">Петродворцовый</option>
                    <option value="primorsky">Приморский</option>
                    <option value="pushkinsky">Пушкинский</option>
                    <option value="frunzensky">Фрунзенский</option>
                    <option value="tsentralny">Центральный</option>
                </select>

                <p>Категория проблемы:</p>
                <select className='modal-window__selection' value={problem} onChange={e => setProblem(e.target.value)}>
                    <option value="">Выберите вид проблемы</option>
                    <option value="parking">Парковки</option>
                    <option value="transport">Транспорт</option>
                    <option value="lighting">Освещение</option>
                    <option value="housing_services">ЖКХ</option>
                    <option value="improvement">Благоустройство</option>
                    <option value="garbage">Мусор</option>
                    <option value="noise">Шум</option>
                </select>

                <p>Дополнительное описание:</p>
                <div className="input-wrapper">
                    <input type="text"
                        placeholder=""
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