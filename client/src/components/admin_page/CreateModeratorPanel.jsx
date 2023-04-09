import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import cl from '../../styles/AdminPage.module.css'

const CreateModeratorPanel = ({ createModer }) => {
    const usernameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [isUsernameInFocus, setIsUsernameInFocus] = useState(false);
    const [isEmailInFocus, setIsEmailInFocus] = useState(false);
    const [isPasswordInFocus, setIsPasswordInFocus] = useState(false);
    const [isValidated, setIsValidated] = useState(false);

    useEffect(() => {
        if (isUsernameValidated && isPasswordValidated && isEmailValidated)
            setIsValidated(true);
        else
            setIsValidated(false);
    }, [isUsernameValidated, isPasswordValidated, isEmailValidated]);

    const resetAllStates = () => {
        usernameInput.current.value = '';
        emailInput.current.value = '';
        passwordInput.current.value = '';
        setIsUsernameValidated(false);
        setIsEmailValidated(false);
        setIsPasswordValidated(false);
    };

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

    const create = (event) => {
        event.preventDefault();
        createModer(usernameInput.current.value, emailInput.current.value, passwordInput.current.value, resetAllStates);
    };

    return (
        <Form className='w-100 rounded-4 main-border p-3' onSubmit={create}>
            {!isUsernameValidated && isUsernameInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Имя модератора должно состоять из 4-20 символов и может содержать только латинские буквы, цифры, знаки «_» и «-»!
                    </Form.Text>
                </Form.Group>
            }
            {!isEmailValidated && isEmailInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Проверьте корректность адреса электронной почты!
                    </Form.Text>
                </Form.Group>
            }
            {!isPasswordValidated && isPasswordInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Пароль должен состоять из 8-30 символов и включать как минимум по 1 латинской букве в верхнем и нижнем регистре, 1 цифру и 1 специальный символ (!, @, #, $, %, ^, &, *)!
                    </Form.Text>
                </Form.Group>
            }
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.usernameInput} as="input" type="text" className='rounded-4 p-3 bg-transparent' placeholder="Имя модератора*"
                        ref={usernameInput} onChange={checkUsername} autoComplete='off'
                        onFocus={() => setIsUsernameInFocus(true)} onBlur={() => setIsUsernameInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.emailInput} as="input" type="email" className='rounded-4 p-3 bg-transparent' placeholder="Адрес электронной почты*"
                        ref={emailInput} onChange={checkEmail} autoComplete='off'
                        onFocus={() => setIsEmailInFocus(true)} onBlur={() => setIsEmailInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup>
                    <Form.Control id={cl.passwordInput} as="input" type="text" className='main-border rounded-4 p-3 bg-transparent' placeholder="Пароль*"
                        ref={passwordInput} onChange={checkPassword} autoComplete='off'
                        onFocus={() => setIsPasswordInFocus(true)} onBlur={() => setIsPasswordInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <button id={cl.createOrUpdate} type="submit" className='w-100 rounded-4 p-3 sub-font-reg bg-transparent'
                disabled={!isValidated}>Добавить модератора</button>
        </Form>
    );
};

export default CreateModeratorPanel;