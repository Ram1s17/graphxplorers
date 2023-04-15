import React, { useContext } from "react";
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom";
import cl from './CustomNavbar.module.css';
import { Context } from "../../../..";

const CustomNavbar = () => {
    const { store } = useContext(Context);

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
                        <Nav.Link as={Link} to="/me" className={`main-font-bold text-white ${cl.navbarItem}`}>Личный кабинет <i className='bi bi-person-circle' /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;