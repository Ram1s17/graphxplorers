import React, { useContext } from "react";
import { Col, Form } from "react-bootstrap";
import { Context } from "../..";
import cl from '../../styles/QuestionManagementPage.module.css';
import { useNavigate, useParams } from "react-router-dom";
import { checkNumberValue } from "../../lib/validationUtil";
import QuestionManagementService from "../../services/QuestionManagementService";
import { observer } from "mobx-react-lite";

const QuestionViewPanel = ({ setIsViewMod, points, question, answerOptions, setAnswerOptions }) => {
    const { store, modalWinStore } = useContext(Context);
    const { id } = useParams();
    const router = useNavigate();

    const createOrUpdateTheotyQuestion = async () => {
        if (!question) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Текст вопроса пустой!');
        }
        else if (answerOptions.length < 2) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('На вопрос должно быть не менее 2 вариантов ответа!');
        }
        else if (!checkNumberValue(points) || Number(points) > 10 || Number(points) === 0) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Некорректное количество баллов!');
        }
        else {
            try {
                let response = null;
                if (id === 'new') {
                    response = await QuestionManagementService.createTheoryQuestion(points, question, { options: answerOptions });
                }
                else {
                    response = await QuestionManagementService.updateTheoryQuestion(id, points, question, { options: answerOptions });
                }
                modalWinStore.setIsSuccessType(true);
                modalWinStore.setTitle('Успешно');
                modalWinStore.setBody(response.data);
                router('/questions');
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
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody(e?.message);
                }
            }
        }
    };

    const changeCheck = (optionID, bool) => {
        setAnswerOptions([
            ...answerOptions.slice(0, optionID - 1),
            { ...answerOptions[optionID - 1], isTrue: bool },
            ...answerOptions.slice(optionID)
        ]);
    };

    const deleteAnswerOption = (optionID) => {
        if (answerOptions.length > 2) {
            const updatedAnswerOptions = answerOptions.slice(optionID).map((option) => {
                option.id = option.id - 1;
                return option;
            });
            setAnswerOptions([
                ...answerOptions.slice(0, optionID - 1),
                ...updatedAnswerOptions
            ]);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody('Вариант ответа удален');
        }
        else {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('На вопрос должно быть не менее 2 вариантов ответа!');
        }
    };

    return (
        <Col>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div className='d-flex align-items-center'>
                    <i className={`${cl.prevButton} bi bi-arrow-left-circle fs-3 me-3`} onClick={() => setIsViewMod(false)}></i>
                    <h3 className='main-font-bold mb-0'>Просмотр теоретического вопроса</h3>
                </div>
                <div>
                    <p className='main-font-bold fs-4 mb-0'>Количество баллов: {points}</p>
                </div>
            </div>
            <div className='p-3 rounded-4 main-border mb-4'>
                <h5 className='main-font-bold'>Вопрос</h5>
                <p className='fs-5 text-black'>{question}</p>
            </div>
            {answerOptions.length > 0 ? answerOptions.map((option) =>
                <div key={option.id} className={`${cl.answerOption} p-3 rounded-4 main-border align-items-center mb-2`}>
                    <p className='main-font-bold mb-0 fs-3 text-center'>#{option.id}</p>
                    <Form.Check
                        type='checkbox'
                        className='fs-4'
                        checked={option.isTrue}
                        value={option.isTrue}
                        onChange={(e) => changeCheck(Number(option.id), e.target.checked)}
                    />
                    <div className='ck-content' dangerouslySetInnerHTML={{ __html: option.text }}></div>
                    <div className='d-flex justify-content-center'>
                        <i className={`${cl.deleteButton} bi bi-trash fs-4`} onClick={() => deleteAnswerOption(Number(option.id))}></i>
                    </div>
                </div>
            ) :
                <div className='text-center'>
                    <p className='main-font-bold mb-0 fs-5'><i class="bi bi-x-octagon-fill"></i> Варианты ответа отсутствуют</p>
                </div>
            }
            <div className='d-flex justify-content-end mt-4'>
                <button className='problem-management-button main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                    onClick={createOrUpdateTheotyQuestion}>Сохранить</button>
            </div>
        </Col>
    );
};

export default observer(QuestionViewPanel);