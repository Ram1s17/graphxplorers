import React, { useRef, useContext, useMemo } from "react";
import { Form } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { getNodeLabel } from "../../lib/content";
import { checkCapacityAndFlow } from "../../lib/validationUtil";
import cl from "../../styles/TestsPage.module.css";

const NewCapacitiesSubPanel = ({ question, cyRefInteraction }) => {
    const sourceNodeSelect = useRef();
    const targetNodeSelect = useRef();
    const newCapacityInput = useRef();
    const { modalWinStore } = useContext(Context);

    const sourceNodesList = useMemo(() => {
        return Array.from(question.question_content.pathNodes);
    }, [question.question_content.pathNodes]);

    const targetNodesList = useMemo(() => {
        return Array.from(question.question_content.pathNodes);
    }, [question.question_content.pathNodes]);

    const updateCapacity = () => {
        const newCapacity = newCapacityInput.current.value;
        if (!checkCapacityAndFlow(newCapacity)) {
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
            else if (targetNodesList.indexOf(targetNodeValue) - sourceNodesList.indexOf(sourceNodeValue) !== 1 &&
                sourceNodesList.indexOf(sourceNodeValue) - targetNodesList.indexOf(targetNodeValue) !== 1) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('Выбрана дуга, не входящая в исходный путь!');
            }
            else {
                let sourceNode = 0, targetNode = 0;
                const edges = cyRefInteraction.current.json().elements.edges.map((el) => {
                    sourceNode = +el.data.source;
                    targetNode = +el.data.target;
                    if (sourceNode === sourceNodeValue && targetNode === targetNodeValue) {
                        el.data.newCapacity = Number(newCapacityInput.current.value)
                        el.data.label = Number(newCapacityInput.current.value);
                    }
                    return el;
                });
                cyRefInteraction.current.elements().remove();
                const nodes = question.question_content.interactionGraph.slice(0, question.question_content.config.countOfNodes);
                cyRefInteraction.current.add(nodes.concat(edges));
            }
        }
        newCapacityInput.current.value = '';
    };

    const switchNodes = () => {
        const sourceNode = sourceNodeSelect.current.value;
        const targetNode = targetNodeSelect.current.value;
        sourceNodeSelect.current.value = targetNode;
        targetNodeSelect.current.value = sourceNode;
    };

    return (
        <div className='d-flex justify-content-start align-items-center p-1 rounded-4 main-border me-3'>
            <p className='mb-0 sub-font-reg fs-3 me-1'>c</p>
            <p className='mb-0 sub-font-reg fs-3 me-1'>(</p>
            <Form.Select className='rounded-4' ref={sourceNodeSelect}>
                {sourceNodesList.map((node) =>
                    <option key={node} className='text-center' value={node}>{getNodeLabel(question.question_content.config, node)}</option>
                )}
            </Form.Select>
            <p className='mb-0 sub-font-reg fs-5 ms-1 fs-3 me-1'>;</p>
            <Form.Select className='rounded-4' ref={targetNodeSelect}>
                {targetNodesList.map((node) =>
                    <option key={node} className='text-center' value={node}>{getNodeLabel(question.question_content.config, node)}</option>
                )}
            </Form.Select>
            <p className='mb-0 sub-font-reg ms-1 fs-3 me-1'>)</p>
            <p className='mb-0 sub-font-reg fs-3 me-1'>=</p>
            <Form.Control as="input" type="number" min={0} className='rounded-4 sub-font-reg text-center me-1'
                autoComplete='off' ref={newCapacityInput} />
            <div>
                <button id={cl.changeCapacityButton} className='main-border rounded-4 sub-font-reg color-3 ps-3 pe-3 w-100 mb-1'
                    onClick={updateCapacity}><i className="bi bi-plus-lg"></i></button>
                <button id={cl.switchNodesButton} className='main-border rounded-4 sub-font-reg color-3 ps-3 pe-3 w-100'
                    onClick={switchNodes}><i className="bi bi-arrow-left-right"></i></button>
            </div>
        </div>
    );
};

export default observer(NewCapacitiesSubPanel);