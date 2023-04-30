import React, { useState, useContext } from "react";
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom";
import cl from './CustomNavbar.module.css';
import { Context } from "../../../..";
import LeaveConfirmationModal from "../LeaveConfirmationModal";

const CustomNavbar = () => {
    const { store } = useContext(Context);
    const router = useNavigate();
    const [showModal, setShowModal] = useState(false);

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

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to={store.userRole !== 'MODERATOR' ? "/main" : "/theory"} replace className={`main-font-bold text-white ${cl.navbarItem}`}>GraphXplorers</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ms-auto'>
                        <Nav.Link as={Link} to="/theory" className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Теория</Nav.Link>
                        <Nav.Link as={Link} to="/tests" className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Тесты</Nav.Link>
                        <Nav.Link as={Link} to="/practice" className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Решение задач</Nav.Link>
                        {store.userRole === 'MODERATOR' && <Nav.Link as={Link} className={`main-font-bold text-white ${cl.navbarItem}`}
                            onClick={() => setShowModal(true)}><i className='bi bi-box-arrow-right' /> Выйти</Nav.Link>}
                        {store.userRole === 'USER' && <Nav.Link as={Link} to="/me" className={`main-font-bold text-white ${cl.navbarItem}`}>Личный кабинет <i className='bi bi-person-circle' /></Nav.Link>}
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