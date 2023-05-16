import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import cl from "../../styles/TestsPage.module.css";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const TheoryQuestionPanel = ({ question, setIsTestCompleted }) => {
    const [answerOptions, setAnswerOptions] = useState([]);
    const { store, testSolvingStore } = useContext(Context);

    useEffect(() => {
        setAnswerOptions(question.question_content.options);
    }, [question.question_content.options, testSolvingStore.currentIndex]);

    const changeCheck = (optionID, bool) => {
        setAnswerOptions([
            ...answerOptions.slice(0, optionID - 1),
            { ...answerOptions[optionID - 1], userSelect: bool },
            ...answerOptions.slice(optionID)
        ]);
    };

    const checkAnswerForTheoreticalQuestion = async () => {
        try {
            const response = await testSolvingStore.checkAnswerForTheoreticalQuestion(answerOptions);
            if (response.data.result) {
                testSolvingStore.setUserPoints(testSolvingStore.userPoints + question.question_points);
            }
            if (testSolvingStore.currentIndex < testSolvingStore.questions.length - 1) {
                testSolvingStore.setCurrentIndex(testSolvingStore.currentIndex + 1);
            }
            else {
                setIsTestCompleted(true);
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
        }
    };

    return (
        <Row className='p-3'>
            <Col xl={12} className='color-2 main-border rounded-4 p-4 d-flex flex-column align-items-center'>
                <div className='w-100 d-flex justify-content-end'>
                    <p className='sub-font-reg fs-5'>Баллы за ответ: <b>{question.question_points}</b></p>
                </div>
                <div className='w-100 main-border rounded-4 p-3 bg-white d-flex flex-column mb-3'>
                    <p className='sub-font-reg mb-0'>Вопрос:</p>
                    <h5 className='main-font-bold'>{question.question_text}</h5>
                </div>
                {answerOptions.map(option =>
                    <div key={option.id} className={`${cl.answerOption} w-100 main-border rounded-4 p-3 bg-white mb-2`}>
                        <Form.Check
                            type='checkbox'
                            className={`${cl.answerCheck} fs-5 d-flex justify-content-end me-3`}
                            checked={option.userSelect}
                            value={option.userSelect}
                            onChange={(e) => changeCheck(Number(option.id), e.target.checked)}
                        />
                        <div className='ck-content'
                            dangerouslySetInnerHTML={{ __html: option.text }}>
                        </div>
                    </div>
                )}
                <div className='w-100 d-flex justify-content-end'>
                    <button id={cl.sendAnswerButton} className='main-border color-3 rounded-4 px-5 py-2 main-font-bold fs-5'
                        onClick={checkAnswerForTheoreticalQuestion}>Ответить</button>
                </div>
            </Col>
        </Row>
    );
};

export default observer(TheoryQuestionPanel);