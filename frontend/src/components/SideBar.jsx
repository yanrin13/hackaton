import { useState } from 'react'
import Content from './Content'
import Map from './Map/Map'

import email from '../assets/email.svg'
import phone from '../assets/phone.svg'
import tg from '../assets/tg.svg'
import logo from '../assets/icon.svg'
import LoginModal from './Modal/LoginModal'
import RequestModal from './Modal/RequestModal'

export default function SideBar() {
    const [mapOpen, setMapOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const [requestOpen, setRequestOpen] = useState(false)
    // onClick={() => setLoginOpen(true)}
    return (
        <div className="content">
            <div className="sidebar">
                <div className='sidebar__logowrap'>
                    <img className='sidebar__logo' src={logo} alt="логотип" />
                    <h1 className='sidebar__title'>Город решений</h1>
                </div>
                <div className='sidebar__btn'
                onClick={() => setMapOpen(!mapOpen)}>
                    {mapOpen && 'Карта происшествий' || 'Статистика'}
                </div>
                <div className='sidebar__btn'
                onClick={() => setRequestOpen(true)}
                >Оставить заявку</div>
                <div className="sidebar__contacts">
                    <h2 className='contacts__title'>Контакты</h2>
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
            {loginOpen && (
                <LoginModal
                    onClose={() => setLoginOpen(false)}
                />
            )}
            {requestOpen && (
                <RequestModal
                    onClose={() => setRequestOpen(false)}
                />
            )}
            {mapOpen && <Map/> || <Content />}
        </div>
        
    )
}