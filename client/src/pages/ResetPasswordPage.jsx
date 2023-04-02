import React, { useState, useRef, useEffect, useContext } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import cl from '../styles/ResetPasswordPage.module.css'
import { useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/AuthService';
import { Context } from "..";
import { observer } from "mobx-react-lite";


const ResetPasswordPage = () => {
    const newPasswordInput = useRef();
    const passwordConfirmationInput = useRef();
    const [isPasswordType, setIsPasswordType] = useState(true);
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [isPasswordInFocus, setIsPasswordInFocus] = useState(false);
    const [isMatch, setIsMatch] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const { id, token } = useParams();
    const router = useNavigate();
    const { modalWinStore } = useContext(Context);

    useEffect(() => {
        async function check() {
            try {
                if (!(+id)) {
                    throw Error();
                }
                await AuthService.checkResetLink(id, token);
            }
            catch (e) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody(e?.message);
                router('/auth', { replace: true });
            }
        }
        check();
    }, []);

    useEffect(() => {
        if (isPasswordValidated && isMatch)
            setIsValidated(true);
        else
            setIsValidated(false);
    }, [isPasswordValidated, isMatch]);

    const checkPassword = () => {
        const isPasswordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,30}$/.test(newPasswordInput.current.value);
        isPasswordValid ? setIsPasswordValidated(true) : setIsPasswordValidated(false);
        checkMatch();
    };

    const checkMatch = () => {
        (newPasswordInput.current.value === passwordConfirmationInput.current.value) ? setIsMatch(true) : setIsMatch(false);
    };

    const resetPassword = async (event) => {
        try {
            event.preventDefault();
            const response = await AuthService.resetPassword(id, token, newPasswordInput.current.value);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.data);
            router('/auth', { replace: true });
        }
        catch (e) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody(e?.message);
            router('/auth', { replace: true });
        }
    };

    return (
        <Row className='d-flex justify-content-center align-items-center color-2'>
            <Col xl={6} className='d-flex flex-column justify-content-center align-items-center'>
                <Form className='rounded-4 main-border p-5 w-100' onSubmit={resetPassword}>
                    <Form.Label className='main-font-bold mb-2 d-block text-center fs-3'>Сброс пароля</Form.Label>
                    {!isPasswordValidated && isPasswordInFocus &&
                        <Form.Group className='mb-3 text-center'>
                            <Form.Text className='sub-font-reg text-danger fs-6'>
                                Пароль должен состоять из 8-30 символов и включать как минимум по 1 латинской букве в верхнем и нижнем регистре, 1 цифру и 1 специальный символ (!, @, #, $, %, ^, &, *)!
                            </Form.Text>
                        </Form.Group>
                    }
                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <Form.Control id={cl.resetInput} as="input" type={isPasswordType ? "password" : "text"} className='color-2 p-3 rounded-4' placeholder="Новый пароль*"
                                ref={newPasswordInput} onChange={checkPassword} autoComplete='off'
                                onFocus={() => setIsPasswordInFocus(true)} onBlur={() => setIsPasswordInFocus(false)} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <Form.Control id={cl.confirmInput} as="input" type={isPasswordType ? "password" : "text"} className='color-2 p-3 rounded-4' placeholder="Повторите пароль*"
                                ref={passwordConfirmationInput} autoComplete='off'
                                onChange={checkMatch} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <InputGroup className='d-flex justify-content-center align-items-center'>
                            <Form.Check as="input" type="checkbox" label="Показать пароли" onChange={() => setIsPasswordType(!isPasswordType)}
                                className='sub-font-reg' />
                        </InputGroup>
                    </Form.Group>
                    <button id={cl.resetButton} type="submit" className='w-100 rounded-4 p-3 color-2 sub-font-reg'
                        disabled={!isValidated}>Обновить пароль</button>
                </Form>
            </Col>
        </Row>
    );
};

export default observer(ResetPasswordPage);