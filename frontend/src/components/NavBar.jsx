import icon from '../../public/icon.svg'

export default function NavBar() {
    return (
        <div className="nav">
            <img className="nav__logo" src={icon} alt="logo" />
            <h1>Город решений</h1>
        </div>
    )
}