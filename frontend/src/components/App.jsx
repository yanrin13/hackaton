import { useState, useEffect } from 'react'
import Content from './Content'
import MapComponent from './Map/Map'
import { ToastContainer } from "react-toastify";
import email from '../assets/email.svg'
import phone from '../assets/phone.svg'
import tg from '../assets/tg.svg'
import logo from '../assets/icon.svg'
import LoginModal from './Modal/LoginModal'
import RequestModal from './Modal/RequestModal'

export default function App() {
    const [mapOpen, setMapOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const [requestOpen, setRequestOpen] = useState(false)

    const [categoriesData, setCategoriesData] = useState({})
    const [districtData, setDistrictData] = useState({})
    const [periodData, setPeriodData] = useState({})

    useEffect(() => {
        fetch('http://localhost:8888/api/analitic/categories')
            .then(r => r.json())
            .then(setCategoriesData)
            .catch(console.error)

        fetch('http://localhost:8888/api/analitic/district')
            .then(r => r.json())
            .then(setDistrictData)
            .catch(console.error)
        fetch('http://localhost:8888/api/analitic/period')
            .then(r => r.json())
            .then(setPeriodData)
            .catch(console.error)
    }, [])
    return (
        <div className="content">
            <div className="sidebar">
                <div className='sidebar__logowrap'>
                    <img className='sidebar__logo' src={logo} alt="логотип" />
                    <h1 className='sidebar__name'>Город решений</h1>
                </div>
                <div className='sidebar__btn'
                    onClick={() => setMapOpen(!mapOpen)}>
                    {mapOpen && 'Статистика' || 'Карта происшествий'}
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
            {requestOpen && (
                <RequestModal
                    onClose={() => setRequestOpen(false)}
                />
            )}
            {mapOpen ? <MapComponent /> : <Content
                categoriesData={categoriesData}
                districtData={districtData}
                periodData={periodData}
            />}
            <ToastContainer />
        </div>

    )
}