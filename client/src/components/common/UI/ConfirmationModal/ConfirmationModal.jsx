import React from "react";
import { Modal } from "react-bootstrap";
import cl from './ConfirmationModal.module.css'

const ConfirmationModal = ({ showModal, setShowModal, title, body, setIsConfirmed }) => {
    const onCloseModal = () => {
        setShowModal(false);
    };

    const confirmHandler = () => {
        setIsConfirmed(true);
        onCloseModal();
    };

    return (
        <Modal
            show={showModal}
            onHide={onCloseModal}
            animation={false}
            size="md"
            centered
        >
            <Modal.Body className='color-4 p-4 rounded-4 main-border'>
                <h2 className='main-font-bold text-center fs-3'>{title}</h2>
                {body && <p className='sub-font-reg text-black text-center'>{body}</p>}
                <div className='d-flex justify-content-evenly align-items-center pt-4'>
                    <button id={cl.backButton} className='color-4 rounded-4 main-border sub-font-reg ps-5 pe-5 pt-2 pb-2'
                        onClick={onCloseModal}>Отмена</button>
                    <button id={cl.confirmButton} className='color-4 rounded-4 main-border sub-font-reg ps-5 pe-5 pt-2 pb-2'
                        onClick={confirmHandler}>Подтвердить</button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmationModal;