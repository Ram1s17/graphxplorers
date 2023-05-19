import React, { useState, useContext } from "react";
import { Col } from "react-bootstrap";
import cl from "../../styles/TestsPage.module.css";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const TestSelectionItem = ({ title, body, maxValue, type }) => {
    const [countOfQuestions, setCountOfQuestions] = useState('');
    const { modalWinStore, testSolvingStore } = useContext(Context);
    const router = useNavigate();

    const startTest = () => {
        if (countOfQuestions === '' || countOfQuestions.includes('e') || countOfQuestions.includes('E') ||
            countOfQuestions.includes('.') || countOfQuestions.includes(',') || countOfQuestions.includes('-') ||
            Number(countOfQuestions) < 3 || Number(countOfQuestions) > maxValue) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Некорректное количество вопросов!');
            setCountOfQuestions('');
        }
        else {
            testSolvingStore.setCountOfQuestions(Number(countOfQuestions));
            testSolvingStore.setTypeOfTest(type);
            router('/tests/testing');
        }
    };

    return (
        <Col xl={5} className={`${cl.selectionItem} d-flex flex-column align-items-center main-border rounded-4 p-3`}>
            <h4 className='main-font-bold'>{title}</h4>
            <p className='sub-font-reg text-center'>{body}</p>
            <div className='d-flex justify-content-center align-items-center mb-3'>
                <p className="mb-0 text-black me-3 main-font-bold">Выберите количество вопросов:</p>
                <input type="number" min={3} className='rounded-4 sub-font-reg text-center bg-white' autoComplete='off'
                    placeholder={`макс -  ${maxValue}`} value={countOfQuestions} onChange={(e) => setCountOfQuestions(e.target.value)}
                />
            </div>
            <button className={`${cl.startButton} main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold`}
                onClick={startTest}>Начать тест</button>
        </Col>
    );
};

export default observer(TestSelectionItem);