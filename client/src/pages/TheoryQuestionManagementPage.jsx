import React, { useEffect, useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import { useNavigate, useParams } from "react-router-dom";
import cl from '../styles/QuestionManagementPage.module.css';
import { Context } from "..";
import { observer } from "mobx-react-lite";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";
import TheoryQuestionConfigPanel from "../components/question_management_page/TheoryQuestionConfigPanel";
import AnswerOptionsConfigPanel from "../components/question_management_page/AnswerOptionsConfigPanel";
import QuestionViewPanel from "../components/question_management_page/QuestionViewPanel";
import QuestionManagementService from "../services/QuestionManagementService";

const TheoryQuestionManagementPage = () => {
    const [isViewMod, setIsViewMod] = useState(false);
    const [currentOptionID, setCurrentOptionID] = useState(0);
    const [points, setPoints] = useState('0');
    const [question, setQuestion] = useState('');
    const [answerOptions, setAnswerOptions] = useState([]);
    const router = useNavigate();
    const { id } = useParams();
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                if (id !== 'new') {
                    if (!(+id))
                        router('/questions');
                    else {
                        const response = await QuestionManagementService.getTheoryQuestion(id);
                        setPoints(String(response.data.question_points));
                        setQuestion(response.data.question_text);
                        setAnswerOptions(response.data.question_content.options);
                    }
                }
            }
            catch (e) {
                if (e?.status === 401) {
                    await store.logout();
                    store.setError({ bool: true, message: e?.message });
                }
                else if (e?.status === 500 || e?.status === 503) {
                    store.setError({ bool: true, message: e?.message });
                }
                else if (e?.status === 400) {
                    router('/questions');
                }
            }
        }
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
                <Row className='d-flex justify-content-center'>
                    <Col>
                        <Row className={`${cl.managementPanel} rounded-4 p-4 m-2`}>
                            {!isViewMod &&
                                <TheoryQuestionConfigPanel
                                    setIsViewMod={setIsViewMod}
                                    points={points} setPoints={setPoints}
                                    question={question} setQuestion={setQuestion} />}
                            {!isViewMod &&
                                <AnswerOptionsConfigPanel
                                    currentOptionID={currentOptionID} setCurrentOptionID={setCurrentOptionID}
                                    answerOptions={answerOptions} setAnswerOptions={setAnswerOptions} />}
                            {isViewMod &&
                                <QuestionViewPanel
                                    setIsViewMod={setIsViewMod} points={points} question={question}
                                    answerOptions={answerOptions} setAnswerOptions={setAnswerOptions} />}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(TheoryQuestionManagementPage);