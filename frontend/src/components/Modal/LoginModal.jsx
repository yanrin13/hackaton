import { createPortal } from 'react-dom'
import { useState } from 'react';
import eye from '../../assets/eye.svg'
import eye_close from '../../assets/eye-close.svg'
import { ToastContainer, toast } from 'react-toastify';

export default function LoginModal({onClose}) {
    const modalRoot = document.getElementById("modal-autho");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        fetch('/api/auth/login', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: name,
                password: password
            })
        }).then(res => {
            if (!res.ok) throw new Error("Несуществующий пользователь");
            return res.json();
        })
            .then(data => {
                if (data.status === "OK") {
                    onClose()
                    window.location.reload(false);
                }
            })
            .catch(err => {
                setMessage(err.message)
            });
    }

    const backgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return createPortal((
        <div className='overlay' onMouseDown={backgroundClick}>
            <div className='modal-window'>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input type="text"
                            placeholder="Введите логин"
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="on" />
                    </div>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Введите пароль"
                            autoComplete="on"
                        />
                        <img
                            className="eye-icon"
                            src={showPassword ? eye_close : eye}
                            alt="show password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <button className='sign-btn' type='submit'>Войти</button>
                </form>
                <p className={message ? "message" : ""}>{message}</p>
            </div>
        </div>
        ), modalRoot)
}