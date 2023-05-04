import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Context } from "../..";
import cl from '../../styles/AdminPage.module.css'

const UpdateModeratorPanel = ({ moderators, updateModer }) => {
    const usernameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const idSelect = useRef();
    const [needToBeUpdated, setNeedToBeUpdated] = useState(false);
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [isUsernameInFocus, setIsUsernameInFocus] = useState(false);
    const [isEmailInFocus, setIsEmailInFocus] = useState(false);
    const [isPasswordInFocus, setIsPasswordInFocus] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [hasOption, setHasPotion] = useState(false);
    const [searchIDquery, setSearchIDquery] = useState('');

    const searchedIdList = useMemo(() => {
        if (searchIDquery) {
            return [...moderators].filter(moderator => String(moderator.user_id).includes(searchIDquery));
        }
        return moderators;
    }, [searchIDquery, moderators]);

    useEffect(() => {
        getCurrentModerator();
        if (searchedIdList.length > 0)
            setHasPotion(true);
        else
            setHasPotion(false);
    }, [searchedIdList]);

    const getCurrentModerator = () => {
        const currentModerartor = searchedIdList.find(moder => moder.user_id == idSelect.current.value);
        if (currentModerartor) {
            usernameInput.current.value = currentModerartor.user_name;
            emailInput.current.value = currentModerartor.user_email;
        }
        else {
            usernameInput.current.value = '';
            emailInput.current.value = '';
        }
        passwordInput.current.value = '';
        checkUsername();
        checkEmail();
        checkPassword();
    };

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
    }

    const update = (event) => {
        event.preventDefault();
        updateModer(idSelect.current.value, usernameInput.current.value, emailInput.current.value, passwordInput.current.value, () => { passwordInput.current.value = ''; });
        checkPassword();
    };

    return (
        <Form className='w-100 rounded-4 main-border p-3' onSubmit={update}>
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
            {needToBeUpdated && !isPasswordValidated && isPasswordInFocus &&
                <Form.Group className='mb-3 text-center fs-5'>
                    <Form.Text className='sub-font-reg text-danger'>
                        Пароль должен состоять из 8-30 символов и включать как минимум по 1 латинской букве в верхнем и нижнем регистре, 1 цифру и 1 специальный символ (!, @, #, $, %, ^, &, *)!
                    </Form.Text>
                </Form.Group>
            }
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.idSearch} as="input" type="search" className='rounded-4 p-2 sub-font-reg reg-font-color text-center bg-transparent' placeholder="Поиск по идентификатору"
                        value={searchIDquery} onChange={(e) => setSearchIDquery(e.target.value)} autoComplete='off' />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Select id={cl.idSelect} className='rounded-4 bg-transparent' ref={idSelect} onChange={getCurrentModerator}>
                        {searchedIdList.map((moderator) =>
                            <option key={moderator.user_id} className='text-center' value={moderator.user_id}>{moderator.user_id}</option>
                        )}
                    </Form.Select>
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.usernameInput} as="input" type="text" className='rounded-4 p-3 bg-transparent' placeholder="Имя модератора*"
                        ref={usernameInput} onChange={checkUsername} autoComplete='off' disabled={!hasOption}
                        onFocus={() => setIsUsernameInFocus(true)} onBlur={() => setIsUsernameInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-2'>
                <InputGroup className='mb-0'>
                    <Form.Control id={cl.emailInput} as="input" type="email" className='rounded-4 p-3 bg-transparent' placeholder="Адрес электронной почты*"
                        ref={emailInput} onChange={checkEmail} autoComplete='off' disabled={!hasOption}
                        onFocus={() => setIsEmailInFocus(true)} onBlur={() => setIsEmailInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <Form.Group className='mb-2 d-flex justify-content-center'>
                <Form.Check
                    type='checkbox'
                    label='Требуется обновление пароля'
                    disabled={!hasOption}
                    onChange={resetInputAfterToogle}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <InputGroup>
                    <Form.Control id={cl.passwordInput} as="input" type="text" className='main-border rounded-4 p-3 bg-transparent' placeholder="Пароль*"
                        ref={passwordInput} onChange={checkPassword} autoComplete='off' disabled={!hasOption || !needToBeUpdated}
                        onFocus={() => setIsPasswordInFocus(true)} onBlur={() => setIsPasswordInFocus(false)} />
                </InputGroup>
            </Form.Group>
            <button id={cl.createOrUpdate} type="submit" className='w-100 rounded-4 p-3 sub-font-reg bg-transparent'
                disabled={!isValidated}>Сохранить данные</button>
        </Form>
    );
};

export default UpdateModeratorPanel;