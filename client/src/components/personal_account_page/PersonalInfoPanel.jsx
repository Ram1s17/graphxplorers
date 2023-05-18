import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Context } from "../..";
import cl from '../../styles/PersonalAccoutPage.module.css'
import UserService from "../../services/UserService";
import { observer } from "mobx-react-lite";

const PersonalInfoPanel = ({ personalInfo, setPersonalInfo }) => {
    const usernameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const [needToBeUpdated, setNeedToBeUpdated] = useState(false);
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [isUsernameInFocus, setIsUsernameInFocus] = useState(false);
    const [isEmailInFocus, setIsEmailInFocus] = useState(false);
    const [isPasswordInFocus, setIsPasswordInFocus] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const { store, modalWinStore } = useContext(Context);

    useEffect(() => {
        if (personalInfo) {
            usernameInput.current.value = personalInfo.user_name;
            emailInput.current.value = personalInfo.user_email;
            checkUsername();
            checkEmail();
        }
    }, [personalInfo]);

    useEffect(() => {
        if (!needToBeUpdated && isUsernameValidated && isEmailValidated)
            setIsValidated(true);
        else if (needToBeUpdated && isUsernameValidated && isPasswordValidated && isEmailValidated)
            setIsValidated(true);
        else
            setIsValidated(false);
    }, [isUsernameValidated, isPasswordValidated, isEmailValidated, needToBeUpdated]);

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

    const resetInputAfterToogle = () => {
        setNeedToBeUpdated(!needToBeUpdated);
        passwordInput.current.value = '';
        checkPassword();
    };

    const updatePersonalInfo = async (event) => {
        event.preventDefault();
        try {
            const response = await UserService.updatePersonalInfo(store.userId, usernameInput.current.value, emailInput.current.value, passwordInput.current.value, store.isEmailConfirmed);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.data.message);
            setPersonalInfo({...personalInfo, user_name: response.data.user_name, user_email: response.data.user_email});
            store.setIsEmailConfirmed(response.data.is_confirmed);
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
                setPersonalInfo({...personalInfo, user_name: personalInfo.user_name, user_email: personalInfo.user_email});
            }
        }
        finally {
            passwordInput.current.value = '';
            setNeedToBeUpdated(false);
            checkPassword();
        }
    };

    return (
        <Form className='w-100 ' onSubmit={updatePersonalInfo}>
            {!isUsernameValidated && isUsernameInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Имя пользователя должно состоять из 4-20 символов и может содержать только латинские буквы, цифры, знаки «_» и «-»!
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
            {needToBeUpdated && !isPasswordValidated && isPasswordInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Пароль должен состоять из 8-30 символов и включать как минимум по 1 латинской букве в верхнем и нижнем регистре, 1 цифру и 1 специальный символ (!, @, #, $, %, ^, &, *)!
                    </Form.Text>
                </Form.Group>
            }
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.usernameInput} as="input" type="text" className='rounded-4 p-3' placeholder="Имя пользователя*"
                        ref={usernameInput} onChange={checkUsername} autoComplete='off'
                        onFocus={() => setIsUsernameInFocus(true)} onBlur={() => setIsUsernameInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-2'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.emailInput} as="input" type="email" className='rounded-4 p-3' placeholder="Адрес электронной почты*"
                        ref={emailInput} onChange={checkEmail} autoComplete='off'
                        onFocus={() => setIsEmailInFocus(true)} onBlur={() => setIsEmailInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-2 d-flex justify-content-center'>
                <Form.Check
                    type='checkbox'
                    checked={needToBeUpdated}
                    label='Изменить пароль'
                    onChange={resetInputAfterToogle}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup>
                    <Form.Control id={cl.passwordInput} as="input" type="text" className='main-border rounded-4 p-3' placeholder="Пароль*"
                        ref={passwordInput} onChange={checkPassword} autoComplete='off' disabled={!needToBeUpdated}
                        onFocus={() => setIsPasswordInFocus(true)} onBlur={() => setIsPasswordInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <button id={cl.createOrUpdate} type="submit" className='w-100 rounded-4 p-3 sub-font-reg'
                disabled={!isValidated}>Сохранить данные</button>
        </Form>
    );
};

export default observer(PersonalInfoPanel);