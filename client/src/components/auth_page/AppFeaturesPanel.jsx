import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { authFeatureItems } from "../../lib/content";
import AppFeaturesItem from "./AppFeaturesItem";

const AppFeaturesPanel = React.memo(() => {
    const contentArray = useMemo(() => {
        return authFeatureItems;
    }, []);
    return (
        <Row className='w-100 vh-100 m-0 d-flex justify-content-center align-items-center'>
            <Col xl={10} className='d-flex flex-column'>
                <h1 className='main-font-bold mb-3 text-center'>Добро пожаловать в GraphXplorers!</h1>
                <p className="sub-font-reg reg-font-color text-center">Сервис для обучения решению задач теории графов по теме «Транспортные сети»</p>
                {contentArray.map((val) => {
                    return (<AppFeaturesItem key={val.title} title={val.title} body={val.body} image={val.img} />);
                })}
            </Col>
        </Row>
    );
});

export default AppFeaturesPanel;