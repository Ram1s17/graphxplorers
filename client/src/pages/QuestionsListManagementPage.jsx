import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import TypeFilterBar from "../components/common/UI/TypeFilterBar";
import SearchBar from "../components/common/UI/SearchBar";
import SortBar from "../components/common/UI/SortBar";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";
import cl from '../styles/QuestionManagementPage.module.css'
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import QuestionManagementService from "../services/QuestionManagementService";
import QuestionsListManagementItem from "../components/questions_list_management_page/QuestionsListManagementItem";
import { useQuestions } from "../hooks/useQuestions";

const QuestionsListManagementPage = () => {
    const [questions, setQuestions] = useState([]);
    const [parametrs, setParametrs] = useState({ filterTheory: false, filterInteractive: false, sort: '', query: '' });
    const questionsList = useQuestions(questions, parametrs.filterTheory, parametrs.filterInteractive, parametrs.sort, parametrs.query);
    const { store, modalWinStore } = useContext(Context);
    const router = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await QuestionManagementService.getAllQuestions();
                setQuestions(response.data);
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

    const removeQuestion = async (questionId) => {
        try {
            const response = (await QuestionManagementService.deleteQuestion(questionId)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.message);
            setQuestions(questions.filter(question => question.question_id !== response.question_id));
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
    };

    return (
        <Row >
            <Col>
                <BeforeUnloadComponent
                    blockRoute={true}
                    modalComponentHandler={({ handleModalLeave, handleModalCancel }) => {
                        return (
                            <LeaveConfirmationModal
                                title="Вы действительно хотите покинуть страницу?"
                                body="Несохраненные данные будут утеряны"
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
                <Row className='d-flex justify-content-center mb-4'>
                    <Col xl={10}>
                        <h1 className='main-font-bold text-center'>Панель управления вопросами</h1>
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-4'>
                    <Col xl={10} className="d-flex justify-content-between align-items-center align-content-center">
                        <TypeFilterBar parametrs={parametrs} setParametrs={setParametrs} />
                        <SearchBar parametrs={parametrs} setParametrs={setParametrs} />
                        <SortBar parametrs={parametrs} setParametrs={setParametrs} />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center'>
                    <Col xl={9}>
                        <Row className='d-flex justify-content-between gap-3'>
                            <Col xl={5} className={`${cl.addListItem} ${cl.addButton} main-border rounded-4 p-5 d-flex justify-content-center align-items-center`}
                                onClick={() => router('/questions/theoretical/new')} >
                                <i className="bi bi-plus-square fs-3 me-2"></i><i className="bi bi-journal-bookmark-fill fs-3"></i>
                            </Col>
                            <Col xl={5} className={`${cl.addListItem} ${cl.addButton} main-border rounded-4 p-5 d-flex justify-content-center align-items-center`}>
                                <i className="bi bi-plus-square fs-3 me-2"></i><i className="bi bi-joystick fs-3"></i>
                            </Col>
                            {questionsList.map(question =>
                                <QuestionsListManagementItem key={question.question_id} question={question} remove={removeQuestion} />
                            )}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(QuestionsListManagementPage);