import React, { useEffect, useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import TestSelectionItem from "../components/test_selection_page/TestSelectionItem";
import { Context } from "..";
import TestSolvingService from "../services/TestSolvingService";
import { observer } from "mobx-react-lite";

const TestSelectionPage = () => {
    const [questionCountValues, setQuestionCountValues] = useState({});
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await TestSolvingService.getQuestionsCount();
                setQuestionCountValues(response.data);
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
                <Row className='mb-3'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-2'>
                    <Col xl={10}>
                        <h1 className='main-font-bold text-center'>Выберите вид теста и приступайте к решению!</h1>
                        <p className='sub-font-reg text-black fs-5 text-center'>Результаты сохранятся в личном кабинете, где вы сможете отследить прогресс</p>
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-4 gap-4 p-3'>
                    <TestSelectionItem
                        title="Теоретический тест"
                        body="Проверьте уровень своих теоретических знаний"
                        maxValue={questionCountValues.theoretical}
                        type="theoretical"
                    />
                    <TestSelectionItem
                        title="Интерактивный тест"
                        body="Отработайте отдельные этапы решения задач"
                        maxValue={questionCountValues.interactive}
                        type="interactive"
                    />
                    <TestSelectionItem
                        title="Общий тест"
                        body="Включает проверку знаний как по теории, так и по практике"
                        maxValue={questionCountValues.total}
                        type="mix"
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default observer(TestSelectionPage);