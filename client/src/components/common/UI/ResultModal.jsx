import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";

const ResultModal = () => {
    const { modalWinStore } = useContext(Context);

    const onCloseModal = () => {
        modalWinStore.setIsResultType(false);
        modalWinStore.setTitle('');
        modalWinStore.setResultArray([]);
    };

    return (
        <Modal
            show={modalWinStore.isResultType}
            onHide={onCloseModal}
            size="md"
            centered
        >
            <Modal.Body className='color-3 rounded-4 p-4'>
                <h2 className='main-font-bold text-center mb-3'>{modalWinStore.title}</h2>
                {modalWinStore.resultArray.map((result, index) => 
                     <p key={index} className='sub-font-reg text-black text-center'><i className="bi bi-award"></i> {result.parametr}: <strong>{result.value}</strong></p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default observer(ResultModal);