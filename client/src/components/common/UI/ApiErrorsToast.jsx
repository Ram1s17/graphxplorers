import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Toast, ToastContainer, ToastBody, ToastHeader } from "react-bootstrap";
import { Context } from "../../..";

const ApiErrorsToast = () => {
    const { store } = useContext(Context);
    const cloaseToast = () => {
        store.setError({ bool: false, message: '' });
    };

    return (
        <ToastContainer className="p-3" position="bottom-end">
            <Toast onClose={cloaseToast} show={store.error.bool} delay={5000} autohide>
                <ToastHeader closeButton={false}>
                    <i className="bi bi-bug"></i>
                    <strong className='ms-3 me-auto main-font-bold text-black'>ВНИМАНИЕ</strong>
                </ToastHeader>
                <ToastBody className='sub-font-reg p-6'>{store.error.message}</ToastBody>
            </Toast>
        </ToastContainer>
    );
};

export default observer(ApiErrorsToast);