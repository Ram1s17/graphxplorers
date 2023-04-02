import React from "react";
import { Row, Col } from "react-bootstrap"
import AppFeaturesPanel from "../components/auth_page/AppFeaturesPanel";
import AuthPanel from "../components/auth_page/AuthPanel";

const AuthPage = () => {
    return (
        <Row>
            <Col className='d-flex justify-content-center align-items-center' lg={6}>
                <AppFeaturesPanel />
            </Col>
            <Col className='color-2' lg={6}>
                <AuthPanel />
            </Col>
        </Row>
    );
};

export default AuthPage;