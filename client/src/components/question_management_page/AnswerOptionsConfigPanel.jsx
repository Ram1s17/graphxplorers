import React, { useState, useEffect, useContext } from "react";
import { Col, Form } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Context } from "../..";
import cl from '../../styles/QuestionManagementPage.module.css';
import { observer } from "mobx-react-lite";

const AnswerOptionsConfigPanel = ({ currentOptionID, setCurrentOptionID, answerOptions, setAnswerOptions }) => {
    const [content, setContent] = useState('');
    const { modalWinStore } = useContext(Context);

    useEffect(() => {
        if (currentOptionID !== 0) {
            setContent(answerOptions[currentOptionID - 1].text);
        }
        else {
            setContent('');
        }
    }, [currentOptionID, answerOptions]);

    const createOrUpdateAnswerOption = () => {
        if (currentOptionID === 0) {
            if (answerOptions.length !== 6) {
                setAnswerOptions([
                    ...answerOptions,
                    {
                        id: answerOptions.length + 1,
                        text: content,
                        isTrue: false
                    }
                ]);
                modalWinStore.setIsSuccessType(true);
                modalWinStore.setTitle('Успешно');
                modalWinStore.setBody('Вариант ответа добавлен');
            }
            else {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('На вопрос должно быть не более 6 вариантов ответа!')
            }
            setContent('');
        }
        else {
            setAnswerOptions([
                ...answerOptions.slice(0, currentOptionID - 1),
                { ...answerOptions[currentOptionID - 1], text: content },
                ...answerOptions.slice(currentOptionID)
            ]);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody('Вариант ответа обновлен');
        }
    };

    return (
        <Col xl={12}>
            <h5>Вариант ответа:</h5>
            <div className='d-flex align-items-center mb-2'>
                <p className='sub-font-reg mb-0 me-3'>Выберите идентификатор варианта ответа:</p>
                <Form.Select className={`${cl.optionIDselect} rounded-4 text-center`}
                    value={currentOptionID} onChange={(e) => setCurrentOptionID(Number(e.target.value))}>
                    <option key={0} value={0}>-</option>
                    {answerOptions.map((option) =>
                        <option key={option.id} value={option.id}>{option.id}</option>
                    )}
                </Form.Select>
            </div>
            <CKEditor
                editor={Editor}
                data={content}
                onInit={
                    (editor) => {
                        setContent(editor.getData());
                    }
                }
                onChange={(event, editor) => {
                    setContent(editor.getData());
                }}
            />
            <div className='d-flex justify-content-end mt-3'>
                <button className='problem-management-button main-border color-2 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                    onClick={createOrUpdateAnswerOption}>Сохранить вариант ответа</button>
            </div>
        </Col>
    );
};

export default observer(AnswerOptionsConfigPanel);