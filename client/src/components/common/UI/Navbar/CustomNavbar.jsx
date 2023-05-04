import React, { useState, useContext, useEffect } from "react";
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from "react-router-dom";
import cl from './CustomNavbar.module.css';
import { Context } from "../../../..";
import LeaveConfirmationModal from "../LeaveConfirmationModal";

const CustomNavbar = () => {
    const [activeNavLinks, setActiveNavLinks] = useState({ main: '', theory: '', tests: '', practice: '', me: '' });
    const [showModal, setShowModal] = useState(false);
    const { store } = useContext(Context);
    const router = useNavigate();
    const location = useLocation();

    const logout = async () => {
        try {
            await store.logout();
            router('/auth');
        }
        catch (e) {
            if (e?.status === 401) {
                await store.logout();
                store.setError({ bool: true, message: e?.message });
            }
            else if (e?.status === 500 || e?.status === 503) {
                store.setError({ bool: true, message: e?.message });
            }
        }
    };

    useEffect(() => {
        const states = { main: '', theory: '', tests: '', practice: '', me: '' };
        if (location.pathname.includes('/main')) {
            setActiveNavLinks({ ...states, main: 'active-navlink' });
        }
        else if (location.pathname.includes('/theory')) {
            setActiveNavLinks({ ...states, theory: 'active-navlink' });
        }
        else if (location.pathname.includes('/tests')) {
            setActiveNavLinks({ ...states, tests: 'active-navlink' });
        }
        else if (location.pathname.includes('/practice')) {
            setActiveNavLinks({ ...states, practice: 'active-navlink' });
        }
        else if (location.pathname.includes('/me')) {
            setActiveNavLinks({ ...states, me: 'active-navlink' });
        }
    }, [location]);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to={store.userRole !== 'MODERATOR' ? "/main" : "/theory"} replace className={`main-font-bold text-white ${cl.navbarItem} ${activeNavLinks.main}`}>GraphXplorers</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ms-auto'>
                        <Nav.Link as={Link} to="/theory" className={`main-font-bold text-white me-2 ${cl.navbarItem} ${activeNavLinks.theory}`}>Теория</Nav.Link>
                        <Nav.Link as={Link} to="/tests" className={`main-font-bold text-white me-2 ${cl.navbarItem} ${activeNavLinks.tests}`}>Тесты</Nav.Link>
                        <Nav.Link as={Link} to="/practice" className={`main-font-bold text-white me-2 ${cl.navbarItem} ${activeNavLinks.practice}`}>Решение задач</Nav.Link>
                        {store.userRole === 'MODERATOR' && <Nav.Link as={Link} className={`main-font-bold text-white ${cl.navbarItem}`}
                            onClick={() => setShowModal(true)}><i className='bi bi-box-arrow-right' /> Выйти</Nav.Link>}
                        {store.userRole === 'USER' && <Nav.Link as={Link} to="/me" className={`main-font-bold text-white ${cl.navbarItem} ${activeNavLinks.me}`}>Личный кабинет <i className='bi bi-person-circle' /></Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {showModal && <LeaveConfirmationModal
                title="Вы действительно хотите покинуть страницу?"
                body="Несохраненные данные будут утеряны"
                onClose={() => setShowModal(false)}
                onConfirm={() => logout()} />}
        </Navbar>
    );
};

export default CustomNavbar;