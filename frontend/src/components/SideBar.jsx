import { useState } from 'react'
import Content from './Content'
import Map from './Map/Map'

import email from '../../public/email.svg'
import phone from '../../public/phone.svg'
import tg from '../../public/tg.svg'
import user from '../../public/user.svg'

export default function SideBar() {
    const [mapOpen, setMapOpen] = useState(false)
    return (
        <div className="content">
            <div className="sidebar">
                <div className="sidebar__login">
                    <img src={user} alt="иконка пользователя" />
                    <button className="btn">Войти</button>
                </div>
                <button className='btn'
                onClick={() => setMapOpen(!mapOpen)}>
                    {mapOpen && 'Карта происшествий' || 'Статистика'}
                </button>
                <div className="sidebar__history">
                    <ul className="sidebar__history-list">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div>
                <div className="sidebar__contacts">
                    <h2>Контакты</h2>
                    <ul className='sidebar__contacts-list'>
                        <li className='sidebar__contact'>
                            <img src={phone} alt="номер телефона" />
                            <p>+7(958)469-92-69</p>
                        </li>
                        <li className='sidebar__contact'>
                            <img src={tg} alt="телеграмм канал" />
                            <p>@gorod</p>
                        </li>
                        <li className='sidebar__contact'>
                            <img src={email} alt="адрес электронной почты" />
                            <p>gorod@yandex.ru</p>
                        </li>
                    </ul>
                </div>
            </div>
            {mapOpen && <Content /> || <Map/>}
        </div>
        
    )
}