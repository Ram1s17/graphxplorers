import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";

const ErrorResponseModal = () => {
    const { modalWinStore } = useContext(Context);

    const onCloseModal = () => {
        modalWinStore.setIsErrorType(false);
        modalWinStore.setTitle('');
        modalWinStore.setBody('');
    };

    return (
        <Modal
            show={modalWinStore.isErrorType}
            onHide={onCloseModal}
            size="md"
            centered
        >
            <Modal.Body className='color-4 rounded-4 p-4'>
                <h2 className='main-font-bold text-center'><i className='bi bi-x-circle'></i> {modalWinStore.title}</h2>
                <p className='sub-font-reg text-black text-center'>{modalWinStore.body}</p>
            </Modal.Body>
        </Modal>
    );
};

export default observer(ErrorResponseModal);