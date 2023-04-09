import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from "../..";

const RegistrationForm = ({ title, switchStatus }) => {
    const usernameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const [eyeIcon, setEyeIcon] = useState(false);
    const [isPasswordType, setIsPasswordType] = useState(true);
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [isUsernameInFocus, setIsUsernameInFocus] = useState(false);
    const [isEmailInFocus, setIsEmailInFocus] = useState(false);
    const [isPasswordInFocus, setIsPasswordInFocus] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [isError, setIsError] = useState({ bool: false, message: '' });
    const { store } = useContext(Context);

    const router = useNavigate();

    const tooglePassword = () => {
        setEyeIcon(!eyeIcon);
    }

    const resetAllStates = () => {
        usernameInput.current.value = '';
        emailInput.current.value = '';
        passwordInput.current.value = '';
        setEyeIcon(false);
        setIsPasswordType(true);
        setIsUsernameValidated(false);
        setIsEmailValidated(false);
        setIsPasswordValidated(false);
    };

    useEffect(() => {
        if (switchStatus) {
            resetAllStates();
            setIsError({ bool: false, message: '' });
        }
    }, [switchStatus]);

    useEffect(() => {
        if (eyeIcon)
            setIsPasswordType(false);
        else
            setIsPasswordType(true);
    }, [eyeIcon]);

    useEffect(() => {
        if (isUsernameValidated && isPasswordValidated && isEmailValidated)
            setIsValidated(true);
        else
            setIsValidated(false);
    }, [isUsernameValidated, isPasswordValidated, isEmailValidated]);

    const checkUsername = () => {
        const isUsernameValid = /^[A-aa-z0-9_-]{4,20}$/.test(usernameInput.current.value);
        isUsernameValid ? setIsUsernameValidated(true) : setIsUsernameValidated(false);
    };

    const checkEmail = () => {
        const isEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,255}))$/.test(emailInput.current.value);
        isEmailValid ? setIsEmailValidated(true) : setIsEmailValidated(false);
    };

    const checkPassword = () => {
        const isPasswordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,30}$/.test(passwordInput.current.value);
        isPasswordValid ? setIsPasswordValidated(true) : setIsPasswordValidated(false);
    };

    const registration = async (event) => {
        setIsError({ bool: false, message: '' });
        try {
            event.preventDefault();
            await store.registration(usernameInput.current.value, emailInput.current.value, passwordInput.current.value);
            router('/main', { replace: true });
        }
        catch (e) {
            if (e?.status === 500 || e?.status === 503) {
                store.setError({ bool: true, message: e?.message });
            }
            else {
                setIsError({ bool: true, message: e?.message });
            }
        }
        finally {
            resetAllStates();
        }
    };

    return (
        <Form onSubmit={registration}>
            <Form.Label className='main-font-bold mb-2 d-block text-center fs-3'>{title}</Form.Label>
            {isError.bool &&
                <Form.Group className='mb-3 text-center'>
                    <Form.Text className='sub-font-reg text-danger fw-bold'>
                        {isError.message}
                    </Form.Text>
                </Form.Group>
            }
            {!isUsernameValidated && isUsernameInFocus &&
                <Form.Group className='mb-3 text-center'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Имя пользователя должно состоять из 4-20 символов и может содержать только латинские буквы, цифры, знаки «_» и «-»!
                    </Form.Text>
                </Form.Group>
            }
            {!isEmailValidated && isEmailInFocus &&
                <Form.Group className='mb-3 text-center'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Проверьте корректность адреса электронной почты! Он будет использован для восстановления доступа к учетной записи!
                    </Form.Text>
                </Form.Group>
            }
            {!isPasswordValidated && isPasswordInFocus &&
                <Form.Group className='mb-3 text-center'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Пароль должен состоять из 8-30 символов и включать как минимум по 1 латинской букве в верхнем и нижнем регистре, 1 цифру и 1 специальный символ (!, @, #, $, %, ^, &, *)!
                    </Form.Text>
                </Form.Group>
            }
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id='reg-username-input' as="input" type="text" className='rounded-4 color-2 p-3' placeholder="Имя пользователя*"
                        ref={usernameInput} onChange={checkUsername} autoComplete='off'
                        onFocus={() => setIsUsernameInFocus(true)} onBlur={() => setIsUsernameInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id='reg-email-input' as="input" type="email" className='rounded-4 color-2 p-3' placeholder="Адрес электронной почты*"
                        ref={emailInput} onChange={checkEmail} autoComplete='off'
                        onFocus={() => setIsEmailInFocus(true)} onBlur={() => setIsEmailInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <InputGroup>
                    <Form.Control id='reg-password-input' as="input" type={isPasswordType ? "password" : "text"} className='color-2 p-3' placeholder="Пароль*"
                        ref={passwordInput} onChange={checkPassword} autoComplete='off'
                        onFocus={() => setIsPasswordInFocus(true)} onBlur={() => setIsPasswordInFocus(false)} />
                    <InputGroup.Text id='reg-eye-icon'><i onClick={tooglePassword} className={`bi ${eyeIcon ? "bi-eye" : "bi-eye-slash"}`}></i></InputGroup.Text>
                </InputGroup>
            </Form.Group>
            <button id='registration-button' type="submit" className='w-100 mt-4 rounded-4 p-3 color-2 sub-font-reg'
                disabled={!isValidated}>Зарегистрироваться</button>
        </Form>
    );
};

export default observer(RegistrationForm);