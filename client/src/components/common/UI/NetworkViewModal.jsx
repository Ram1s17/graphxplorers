import React, { useRef, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import CytoscapeComponent from 'react-cytoscapejs';

const NetworkViewModal = () => {
    const { modalWinStore } = useContext(Context);
    let cyRef = useRef();

    useEffect(() => {
        if (modalWinStore.isGraphType) {
            cyRef.center();
            cyRef.elements().remove();
            cyRef.add(modalWinStore.graphElements);
        }
    }, [modalWinStore.isGraphType]);

    return (
        <Modal
            show={modalWinStore.isGraphType}
            onHide={() => modalWinStore.setIsGraphType(false)}
            size="xl"
            centered
            animation={false}
        >
            <Modal.Body id="show-network-modal" className='color-2 rounded-4 p-4' onMouseOver={() => cyRef.center()}>
                <CytoscapeComponent
                    elements={modalWinStore.graphElements}
                    zoom={1}
                    userPanningEnabled={false}
                    userZoomingEnabled={false}
                    autolock={true}
                    autounselectify={true}
                    style={{ width: '95%', height: '95%' }}
                    stylesheet={[
                        {
                            selector: 'node',
                            style: {
                                width: 38,
                                height: 38,
                                'background-color': '#E9E9E9',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'label': 'data(label)'
                            }
                        },
                        {
                            selector: '.colored',
                            style: {
                                'background-color': '#FFF',
                                'border-width': '2px'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: 2,
                                'line-color': '#000',
                                'target-arrow-color': '#000',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier',
                                'text-background-color': '#FFF2C6',
                                'text-background-opacity': 1,
                                'label': 'data(label)',

                            }
                        }
                    ]}
                    cy={(cy) => { cyRef = cy }} />
            </Modal.Body>
        </Modal>
    );
};

export default observer(NetworkViewModal);