import React, { useEffect, useContext, useRef } from "react";
import { Col } from "react-bootstrap";
import CytoscapeComponent from 'react-cytoscapejs';
import cl from '../../styles/QuestionManagementPage.module.css';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { cytoscapeConfig } from "../../lib/content";

const NetworksShowPanel = () => {
    let cyRefView = useRef();
    let cyRefInteraction = useRef();
    const { questionManagementStore } = useContext(Context);

    useEffect(() => {
        cyRefView.current.center();
        cyRefView.current.elements().remove();
        cyRefView.current.add(questionManagementStore.viewNetwork);
    }, [questionManagementStore.viewNetwork]);

    useEffect(() => {
        cyRefInteraction.current.center();
        cyRefInteraction.current.elements().remove();
        cyRefInteraction.current.add(questionManagementStore.interactionNetwork);
    }, [questionManagementStore.interactionNetwork]);

    return (
        <Col xl={12} id={cl.showPanel} className='d-flex'>
            <div className='main-border rounded-4 d-flex flex-column w-50 h-100 justify-content-center align-items-center me-2'
                onMouseOver={() => cyRefView.current.center()}>
                <h6 className='text-center main-font-bold'>Транспортная сеть для просмотра</h6>
                <CytoscapeComponent
                    elements={questionManagementStore.viewNetwork}
                    zoom={cytoscapeConfig.zoom}
                    userPanningEnabled={cytoscapeConfig.userPanningEnabled}
                    userZoomingEnabled={cytoscapeConfig.userZoomingEnabled}
                    autolock={cytoscapeConfig.autolock}
                    autounselectify={cytoscapeConfig.autounselectify}
                    style={cytoscapeConfig.style}
                    stylesheet={cytoscapeConfig.stylesheet}
                    cy={(cy) => { cyRefView.current = cy }} />
            </div>
            <div className='main-border rounded-4 d-flex flex-column w-50 h-100 justify-content-center align-items-center ms-2'
                onMouseOver={() => cyRefInteraction.current.center()}>
                <h6 className='text-center main-font-bold'>Транспортная сеть для взаимодействия</h6>
                <CytoscapeComponent
                    elements={questionManagementStore.interactionNetwork}
                    zoom={cytoscapeConfig.zoom}
                    userPanningEnabled={cytoscapeConfig.userPanningEnabled}
                    userZoomingEnabled={cytoscapeConfig.userZoomingEnabled}
                    autolock={cytoscapeConfig.autolock}
                    autounselectify={cytoscapeConfig.autounselectify}
                    style={cytoscapeConfig.style}
                    stylesheet={cytoscapeConfig.stylesheet}
                    cy={(cy) => { cyRefInteraction.current = cy }} />
            </div>
        </Col>
    );
};

export default observer(NetworksShowPanel);