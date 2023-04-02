import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";

const SuccessResponseModal = () => {
    const { modalWinStore } = useContext(Context);

    const onCloseModal = () => {
        modalWinStore.setIsSuccessType(false);
        modalWinStore.setTitle('');
        modalWinStore.setBody('');
    };

    return (
        <Modal
            show={modalWinStore.isSuccessType}
            onHide={onCloseModal}
            size="md"
            centered
        >
            <Modal.Body className='color-3 rounded-4 p-4'>
                <h2 className='main-font-bold text-center'><i className='bi bi-patch-check'></i> {modalWinStore.title}</h2>
                <p className='sub-font-reg text-black text-center'>{modalWinStore.body}</p>
            </Modal.Body>
        </Modal>
    );
};

export default observer(SuccessResponseModal);