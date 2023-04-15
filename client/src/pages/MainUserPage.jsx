import React, { useMemo } from "react";
import { Row, Col } from 'react-bootstrap'
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import BannerItem from "../components/main_user_page/BannerItem";
import { mainFeatureItems } from '../lib/content';
import cl from '../styles/MainUserPage.module.css'

const MainUserPage = () => {
    const contentArray = useMemo(() => {
        return mainFeatureItems;
    }, []);

    return (
        <Row className={`${cl.mainFrame}`}>
            <Col>
                <Row>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center align-items-center mb-2'>
                    <Col xl={7} className='vh-100 d-flex justify-content-center align-content-center flex-column'>
                        <h1 className={`text-center main-font-bold ${cl.banner}`}>GraphXplorers</h1>
                        <p className='sub-font-reg text-center reg-font-color fs-5 mb-4'>Сервис для обучения решению задач теории графов по теме «Транспортные сети»</p>
                        <Row>
                            {contentArray.map((val) => {
                                return (<BannerItem key={val.buttonText} body={val.body} buttonText={val.buttonText} path={val.path} />);
                            })}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default MainUserPage;