import React, { useEffect, useState, useContext } from "react";
import { Row, Col } from 'react-bootstrap'
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import TheoryService from "../services/TheoryService";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const TheoryPage = () => {
    const [theory, setTheory] = useState('');
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await TheoryService.getTheory();
                setTheory(response.data);
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
        }
        fetchData();
    }, []);

    return (
        <Row >
            <Col>
                <Row className='mb-5'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col xl={10} className='ms-auto me-auto'>
                        <div className='ck-content' dangerouslySetInnerHTML={{ __html: theory }}></div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(TheoryPage);