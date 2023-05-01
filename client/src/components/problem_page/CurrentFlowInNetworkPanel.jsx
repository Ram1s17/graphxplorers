import React, { useEffect, useRef, useContext } from "react";
import CytoscapeComponent from 'react-cytoscapejs';
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const CurrentFlowInNetworkPanel = () => {
    let cyRef = useRef();
    const { problemSolvingStore } = useContext(Context);

    useEffect(() => {
        cyRef.center();
        cyRef.elements().remove();
        cyRef.add(problemSolvingStore.currentFlowInNetwork);
    }, [problemSolvingStore.currentFlowInNetwork]);

    return (
        <div id='current-flow-panel' className='color-3 main-border d-flex justify-content-center align-items-center'
            onMouseOver={() => cyRef.center()}>
            <CytoscapeComponent
                elements={problemSolvingStore.currentFlowInNetwork}
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
                            'text-background-color': '#CBFFE4',
                            'text-background-opacity': 1,
                            'text-rotation': 'autorotate',
                            'label': 'data(label)',

                        }
                    }
                ]}
                cy={(cy) => { cyRef = cy }} />
        </div>
    );
};

export default observer(CurrentFlowInNetworkPanel);