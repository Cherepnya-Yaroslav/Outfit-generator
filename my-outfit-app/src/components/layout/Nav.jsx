import { Link } from 'react-router-dom';

function Nav() {
    return (
        <div className="navContainer">
            <h2>Сборщик гардероба</h2>
            <ul>
                <li><Link to="/" className='navLink'>Главная</Link></li>
                <li><Link to="/gallery" className='navLink'>Ваша галерея</Link></li>
            </ul>
        </div>
    );
}

export default Nav;