import React, { useState, useContext, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { getNodeLabel } from "../../lib/content";
import { checkCapacityAndFlow } from "../../lib/validationUtil";

const AddingEdgesSubpanel = () => {
    const [edgesList, setEdgesList] = useState([]);
    const sourceNodeSelect = useRef();
    const targetNodeSelect = useRef();
    const capacityInput = useRef();
    const { modalWinStore, problemManagementStore } = useContext(Context);

    useEffect(() => {
        setEdgesList(problemManagementStore.edgesList);
    }, [problemManagementStore.edgesList]);

    const switchNodes = () => {
        const sourceNode = sourceNodeSelect.current.value;
        const targetNode = targetNodeSelect.current.value;
        sourceNodeSelect.current.value = targetNode;
        targetNodeSelect.current.value = sourceNode;
    };

    const addEdge = () => {
        const capacity = capacityInput.current.value;
        if (!checkCapacityAndFlow(capacity) || capacity == 0) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введено некорректное значение пропускной способности!');
        }
        else {
            const sourceNodeValue = Number(sourceNodeSelect.current.value);
            const targetNodeValue = Number(targetNodeSelect.current.value);
            if (sourceNodeValue === targetNodeValue) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('Начало и конец дуги совпадают!');
            }
            else {
                let sourceNode = 0, targetNode = 0, isFounded = false;
                const edges = edgesList.map((el) => {
                    sourceNode = +el.data.source;
                    targetNode = +el.data.target;
                    if (sourceNode === sourceNodeValue && targetNode === targetNodeValue) {
                        el.data.newCapacity = Number(capacity)
                        el.data.label = Number(capacity);
                        isFounded = true;
                    }
                    return el;
                });
                if (!isFounded) {
                    problemManagementStore.setEdgesList([...edges, {
                        data: {
                            source: String(sourceNodeValue),
                            target: String(targetNodeValue),
                            label: capacity,
                            capacity: Number(capacity)
                        }
                    }]);
                }
                else {
                    problemManagementStore.setEdgesList(edges);
                }
            }
        }
        capacityInput.current.value = '';
    };

    return (
        <div className='d-flex flex-column mb-4'>
            <p className='main-font-bold mb-2 fs-5'>Панель управления дугами</p>
            <div className='d-flex justify-content-start align-items-center ps-2 pe-2 pt-1 pb-1 rounded-4 main-border'>
                <p className='mb-0 sub-font-reg fs-3 me-1'>c</p>
                <p className='mb-0 sub-font-reg fs-3 me-1'>(</p>
                <Form.Select className='rounded-4' ref={sourceNodeSelect}>
                    {problemManagementStore.nodesList.map((node) =>
                        <option key={node.data.id} className='text-center' value={node.data.id}>{getNodeLabel(problemManagementStore.networkConfig, node.data.id)}</option>
                    )}
                </Form.Select>
                <p className='mb-0 sub-font-reg fs-5 ms-1 fs-3 me-1'>;</p>
                <Form.Select className='rounded-4' ref={targetNodeSelect}>
                    {problemManagementStore.nodesList.map((node) =>
                        <option key={node.data.id} className='text-center' value={node.data.id}>{getNodeLabel(problemManagementStore.networkConfig, node.data.id)}</option>
                    )}
                </Form.Select>
                <p className='mb-0 sub-font-reg ms-1 fs-3 me-1'>)</p>
                <p className='mb-0 sub-font-reg fs-3 me-1'>=</p>
                <Form.Control as="input" type="number" min={0} ref={capacityInput} className='rounded-4 sub-font-reg text-center me-1'
                    autoComplete='off' />
                <button className='problem-button main-border rounded-4 sub-font-reg bg-white ps-3 pe-3 w-100 me-1'
                    onClick={addEdge}><i className="bi bi-plus-lg"></i></button>
                <button className='problem-button main-border rounded-4 sub-font-reg bg-white ps-3 pe-3 w-100'
                    onClick={switchNodes}
                ><i className="bi bi-arrow-left-right"></i></button>
            </div>
        </div>
    );
};

export default observer(AddingEdgesSubpanel);