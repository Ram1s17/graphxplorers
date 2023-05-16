import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";
import CustomTimer from "../components/test_solving_page/CustomTimer";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { getLabelForTypeOfTest } from "../lib/content";
import cl from "../styles/TestsPage.module.css";
import TheoryQuestionPanel from "../components/test_solving_page/TheoryQuestionPanel";
import PathChoiceQuestionPanel from "../components/test_solving_page/PathChoiceQuestionPanel";
import NewCapacitiesQuestionPanel from "../components/test_solving_page/NewCapacitiesQuestionPanel";
import MincutQuestionPanel from "../components/test_solving_page/MincutQuestionPanel";

const TestSolvingPage = () => {
    const [isTestCompleted, setIsTestCompleted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { store, testSolvingStore } = useContext(Context);
    const router = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                if (testSolvingStore.countOfQuestions === 0)
                    router('/tests');
                else
                    await testSolvingStore.getQuestions();
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
        testSolvingStore.initStates();
        fetchData();
    }, []);

    return (
        <Row >
            <Col>
                <BeforeUnloadComponent
                    blockRoute={true}
                    modalComponentHandler={({ handleModalLeave, handleModalCancel }) => {
                        return (
                            <LeaveConfirmationModal
                                title="Вы действительно хотите завершить тест?"
                                body="Ваш прогресс будет утерян"
                                onClose={handleModalCancel}
                                onConfirm={handleModalLeave} />
                        );
                    }}
                />
                <Row className='mb-3'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='d-flex justify-content-between'>
                        <CustomTimer isTestCompleted={isTestCompleted} />
                        <div>
                            <h2 className='main-font-bold text-center mb-0'>Вопросы: {testSolvingStore.currentIndex + 1}/{testSolvingStore.countOfQuestions}</h2>
                            <p className='mb-0 sub-font-reg text-center'>{getLabelForTypeOfTest(testSolvingStore.typeOfTest)}</p>
                        </div>
                        <button id={cl.exitButton} className='main-border color-4 rounded-4 ps-5 pe-5 main-font-bold'
                            onClick={() => setShowModal(true)}>Завершить <i className="bi bi-x-circle"></i></button>
                    </Col>
                </Row>
                {testSolvingStore.questions.length !== 0 && testSolvingStore.questions[testSolvingStore.currentIndex].question_type === 'теоретический' &&
                    <TheoryQuestionPanel question={testSolvingStore.questions[testSolvingStore.currentIndex]} setIsTestCompleted={setIsTestCompleted} />
                }
                {testSolvingStore.questions.length !== 0 && testSolvingStore.questions[testSolvingStore.currentIndex].question_type === 'интерактивный' &&
                    testSolvingStore.questions[testSolvingStore.currentIndex].question_subtype === 'path' &&
                    <PathChoiceQuestionPanel question={testSolvingStore.questions[testSolvingStore.currentIndex]} setIsTestCompleted={setIsTestCompleted} />
                }
                {testSolvingStore.questions.length !== 0 && testSolvingStore.questions[testSolvingStore.currentIndex].question_type === 'интерактивный' &&
                    testSolvingStore.questions[testSolvingStore.currentIndex].question_subtype === 'capacities' &&
                    <NewCapacitiesQuestionPanel question={testSolvingStore.questions[testSolvingStore.currentIndex]} setIsTestCompleted={setIsTestCompleted} />
                }
                {testSolvingStore.questions.length !== 0 && testSolvingStore.questions[testSolvingStore.currentIndex].question_type === 'интерактивный' &&
                    testSolvingStore.questions[testSolvingStore.currentIndex].question_subtype === 'mincut' &&
                    <MincutQuestionPanel question={testSolvingStore.questions[testSolvingStore.currentIndex]} setIsTestCompleted={setIsTestCompleted} />
                }
            </Col>
            {showModal && <LeaveConfirmationModal
                title="Вы действительно хотите завершить тест?"
                body="Ваши ответы сохранены и будут учтены в результате"
                onClose={() => setShowModal(false)}
                onConfirm={() => setIsTestCompleted(true)} />}
        </Row>
    );
};

export default observer(TestSolvingPage);