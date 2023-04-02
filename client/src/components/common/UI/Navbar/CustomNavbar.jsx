import React from "react";
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom";
import cl from './CustomNavbar.module.css';

const CustomNavbar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/main" replace className={`main-font-bold text-white ${cl.navbarItem}`}>GraphXplorers</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ms-auto'>
                        <Nav.Link as={Link} to="/theory" replace className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Теория</Nav.Link>
                        <Nav.Link as={Link} to="/tests" replace className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Тесты</Nav.Link>
                        <Nav.Link as={Link} to="/practice" replace className={`main-font-bold text-white me-2 ${cl.navbarItem}`}>Решение задач</Nav.Link>
                        <Nav.Link as={Link} to="/me" replace className={`main-font-bold text-white ${cl.navbarItem}`}>Личный кабинет <i className='bi bi-person-circle' /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;