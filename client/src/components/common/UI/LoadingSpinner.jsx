import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
    return (
        <Row>
            <Col className='d-flex flex-column justify-content-center align-items-center'>
                <Spinner animation="grow" variant="warning" />
                <h5 className='main-font-bold text-center mt-3'>Загрузка...</h5>
            </Col>
        </Row>
    );
};

export default LoadingSpinner;