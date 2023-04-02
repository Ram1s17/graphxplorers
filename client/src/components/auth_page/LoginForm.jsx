import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from "../..";

const LoginForm = ({ title, switchStatus }) => {
    const usernameInput = useRef();
    const passwordInput = useRef();
    const [eyeIcon, setEyeIcon] = useState(false);
    const [isPasswordType, setIsPasswordType] = useState(true);
    const [isNotEmpty, setIsNotEmpty] = useState(false);
    const [isError, setIsError] = useState({ bool: false, message: '' });
    const { store } = useContext(Context);

    const router = useNavigate();

    const tooglePassword = () => {
        setEyeIcon(!eyeIcon);
    };

    const resetAllStates = () => {
        usernameInput.current.value = '';
        passwordInput.current.value = '';
        setEyeIcon(false);
        setIsPasswordType(true);
        setIsNotEmpty(false);
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

    const checkInput = () => {
        if (usernameInput.current.value.length > 0 && passwordInput.current.value.length > 0)
            setIsNotEmpty(true);
        else
            setIsNotEmpty(false);
    };

    const login = async (event) => {
        setIsError({ bool: false, message: '' });
        try {
            event.preventDefault();
            await store.login(usernameInput.current.value, passwordInput.current.value);
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
        <Form onSubmit={login}>
            <Form.Label className='main-font-bold mb-2 d-block text-center fs-3'>{title}</Form.Label>
            {isError.bool &&
                <Form.Group className='mb-3 text-center'>
                    <Form.Text className='sub-font-reg text-danger fw-bold'>
                        {isError.message}
                    </Form.Text>
                </Form.Group>
            }
            <Form.Group className='mb-3'>
                <InputGroup>
                    <Form.Control id='log-username-input' as="input" type="text" className='rounded-4 color-2 p-3' placeholder="Имя пользователя*"
                        ref={usernameInput} onChange={checkInput} autoComplete='off' />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <InputGroup>
                    <Form.Control id='log-password-input' as="input" type={isPasswordType ? "password" : "text"} className='color-2 p-3' placeholder="Пароль*"
                        ref={passwordInput} onChange={checkInput} autoComplete='off' />
                    <InputGroup.Text id='log-eye-icon'><i onClick={tooglePassword} className={`bi ${eyeIcon ? "bi-eye" : "bi-eye-slash"}`}></i></InputGroup.Text>
                </InputGroup>
            </Form.Group>
            <button id='login-button' type="submit" className='w-100 mt-4 rounded-4 p-3 color-2 sub-font-reg mb-3'
                disabled={isNotEmpty ? false : true}>Войти</button>
        </Form>
    );
};

export default observer(LoginForm);