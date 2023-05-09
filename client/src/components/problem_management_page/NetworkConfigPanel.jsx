import React, { useContext } from "react";
import { Col } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import NodesNamingSubpanel from "./NodesNamingSubpanel";
import SourceSinkSubpanel from "./SourceSinkSubpanel";
import AddingEdgesSubpanel from "./AddingEdgesSubpanel";

const NetworkConfigPanel = () => {
    const { store, modalWinStore, problemManagementStore } = useContext(Context);

    const checkNetwork = async () => {
        if (problemManagementStore.nodesList.length >= 4) {
            try {
                await problemManagementStore.checkNetwork();
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
                }
            }
        }
        else {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody("Количество вершин должно быть не менее 4!");
        }
    };

    return (
        <Col className='d-flex flex-column p-4'>
            <div className='d-flex justify-content-between mb-4'>
                <NodesNamingSubpanel />
                <SourceSinkSubpanel />
            </div>
            <AddingEdgesSubpanel />
            <div className='d-flex flex-column mb-4'>
                <p className='main-font-bold mb-2 fs-5'>Инструкция по взаимодействию с графом:</p>
                <p className='sub-font-reg reg-font-color mb-1 fs-6'>1) Двойное нажатие левой кнопкой мыши (ЛКМ) по свободной области - создание вершины.</p>
                <p className='sub-font-reg reg-font-color mb-1 fs-6'>2) Нажатие ЛКМ по вершине - удаление этой вершины (<b>только последней по порядку</b>).</p>
                <p className='sub-font-reg reg-font-color mb-1 fs-6'>3) Для перемещения вершины удерживайте её ЛКМ.</p>
                <p className='sub-font-reg reg-font-color mb-1 fs-6'>4) Нажатие ЛКМ по дуге - удаление этой дуги.</p>
                <p className='sub-font-reg reg-font-color mb-1 fs-6'><b>ВНИМАНИЕ!</b> Смена нумерации вершин приведет к удаление всех дуг и сбросу значений истока и стока!</p>
            </div>
            <div className='d-flex justify-content-end'>
                <button className='problem-management-button main-border color-2 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                    onClick={checkNetwork}>Далее</button>
            </div>
        </Col>
    );
};

export default observer(NetworkConfigPanel);