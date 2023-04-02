import React, { useState } from "react";
import { Row, Col, Tabs, Tab, TabContent } from 'react-bootstrap';
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { Link } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const AuthPanel = () => {
    const [modalShow, setModalShow] = useState(false);
    const [isLoginTabSelected, setIsLoginTabSelected] = useState(false);
    const [isRegTabSelected, setIsRegTabSelected] = useState(false);

    const onSwitchTab = (index) => {
        if (index === 'login') {
            setIsLoginTabSelected(true);
            setIsRegTabSelected(false);
        }
        else if (index === 'registration') {
            setIsRegTabSelected(true);
            setIsLoginTabSelected(false);
        }
    };

    return (
        <Row className='w-100 vh-100 m-0 d-flex justify-content-center align-items-center'>
            <Col xl={8} className='d-flex flex-column'>
                <Tabs
                    defaultActiveKey="login"
                    id="auth-tabs"
                    className="mb-3 main-font-bold border-bottom-0"
                    justify
                    onSelect={onSwitchTab}
                >
                    <Tab eventKey="login" title="Вход">
                        <TabContent as={LoginForm} title='Вход' switchStatus={isLoginTabSelected} />
                        <div className='d-flex justify-content-end align-items-center'>
                            <Link className='sub-font-reg reg-font-color forgot-password-link' onClick={() => setModalShow(true)}>Забыли пароль?</Link>
                        </div>
                    </Tab>
                    <Tab eventKey="registration" title="Регистрация" className='main-font-bold'>
                        <TabContent as={RegistrationForm} title='Регистрация' switchStatus={isRegTabSelected} />
                    </Tab>
                </Tabs>
            </Col>
            <ForgotPasswordModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Row >
    );
};

export default AuthPanel;