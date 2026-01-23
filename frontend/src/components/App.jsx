import { useState, useEffect } from 'react'
import Content from './Content'
import MapComponent from './Map/Map'
import { ToastContainer } from "react-toastify";
import email from '../assets/email.svg'
import phone from '../assets/phone.svg'
import tg from '../assets/tg.svg'
import logo from '../assets/icon.svg'
import logo_dark from '../assets/icon_dark.svg'
import RequestModal from './Modal/RequestModal'

export default function App() {
    const [mapOpen, setMapOpen] = useState(false)
    const [themeIsBlack, setThemeIsBlack] = useState(false)
    const [requestOpen, setRequestOpen] = useState(false)

    const [selectedDistrict, setSelectedDistrict] = useState('1');
    const [categoriesData, setCategoriesData] = useState({});
    const [districtData, setDistrictData] = useState({})
    const [periodData, setPeriodData] = useState({})
    const [rec, setRec] = useState({})

    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetch('api/analitic/district')
            .then(r => r.json())
            .then(setDistrictData)
            .catch(console.error)
        fetch('api/analitic/period')
            .then(r => r.json())
            .then(setPeriodData)
            .catch(console.error)
        fetch(`api/analitic/categories/1`)
            .then(res => res.json())
            .then(data => setCategoriesData(data))
            .catch(console.error);
        fetch(`api/analitic/recs?c=2`)
            .then(res => res.json())
            .then(rec => setRec(rec))
            .catch(console.error);
    }, [])
    useEffect(() => {
        fetch(`api/analitic/categories/${selectedDistrict}`)
            .then(res => res.json())
            .then(data => setCategoriesData(data))
            .catch(console.error);
    }, [selectedDistrict]);

    useEffect(() => {
        if (themeIsBlack) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }, [themeIsBlack]);

    return (
        <div className="content">
            <button class="burger" onClick={() => {
                setOpen(prev => !prev)
            }} aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={`sidebar ${open ? "sidebar--open" : ""}`}>
                <div className='sidebar__logowrap'>
                    <img className='sidebar__logo' src={themeIsBlack &&  logo_dark || logo} alt="логотип" />
                    <h1 className='sidebar__name'>Город решений</h1>
                </div>
                <div className='sidebar__btn'
                    onClick={() => setMapOpen(!mapOpen)}>
                    {mapOpen && 'Статистика' || 'Карта происшествий'}
                </div>

                <div className='sidebar__btn'
                    onClick={() => {
                        setRequestOpen(true)
                        if (open === true) setOpen(false)
                    }}
                >Оставить заявку</div>

                <div className='sidebar__btn'
                    onClick={() => setThemeIsBlack(!themeIsBlack)}>
                    {themeIsBlack &&  'Светлая тема' || 'Темная тема'}
                </div>

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
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                rec={rec}
                themeIsBlack={themeIsBlack}
            />}
            <ToastContainer />
        </div>

    )
}