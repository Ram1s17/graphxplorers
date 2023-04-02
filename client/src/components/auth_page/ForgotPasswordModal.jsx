import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import AuthService from "../../services/AuthService";

const ForgotPasswordModal = (props) => {
    const emailInput = useRef();
    const [isNotEmpty, setIsNotEmpty] = useState(false);
    const { store, modalWinStore } = useContext(Context);

    useEffect(() => {
        setIsNotEmpty(false);
    }, [props.show]);

    const checkInput = () => {
        if (emailInput.current.value.length > 0)
            setIsNotEmpty(true);
        else
            setIsNotEmpty(false);
    };

    const sendMessageToEmail = async () => {
        props.onHide();
        try {
            const response = await AuthService.forgotPassword(emailInput.current.value);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.data);
        }
        catch (e) {
            if (e?.status === 500 || e?.status === 503) {
                store.setError({ bool: true, message: e?.message });
            }
            else {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody(e?.message);
            }
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            centered
        >
            <Modal.Header closeButton>
                <h3>Восстановление доступа</h3>
            </Modal.Header>
            <Modal.Body>
                <p className='main-font-bold reg-font-color text-center'>Укажите почту, привязанную к учетной записи</p>
                <input id="forgot-password-input" type='email' placeholder="Адрес электронной почты*" className='w-100 rounded-4 main-border p-3 sub-font-reg'
                    ref={emailInput} onChange={checkInput} autoComplete="off" />
                <p className='sub-font-reg reg-font-color mt-3'>На данную почту мы вышлем письмо со ссылкой для сброса пароля. Ссылка будет действительна в течение 15 минут.</p>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center align-items-center'>
                <button id="forgot-password-button" className='color-2 rounded-4 main-border sub-font-reg ps-5 pe-5 pt-2 pb-2'
                    onClick={sendMessageToEmail} disabled={!isNotEmpty}>Подтвердить</button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(ForgotPasswordModal);