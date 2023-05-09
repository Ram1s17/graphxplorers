import React, { useContext, useEffect } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const SourceSinkSubpanel = () => {
    const { problemManagementStore } = useContext(Context);

    useEffect(() => {
        if (problemManagementStore.networkConfig.startsFromZero !== problemManagementStore.sourceStartsFromZero) {
            problemManagementStore.setNetworkConfig({
                ...problemManagementStore.networkConfig,
                source: 1,
                sink: 2
            });
        }
    }, [problemManagementStore.networkConfig.startsFromZero]);

    return (
        <div className='d-flex flex-column'>
            <p className='main-font-bold mb-0 fs-5'>Количество вершин: {problemManagementStore.networkConfig.countOfNodes}</p>
            <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Величина не должна быть меньше 4 и больше 12</p>
            <p className='main-font-bold fs-5 mb-0'>Исток и сток транспортной сети:</p>
            <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Выберите соответствующие вершины</p>
            <div className='d-flex align-items-center'>
                <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1'
                    value={problemManagementStore.networkConfig.source}
                    onChange={(e) => problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, source: Number(e.target.value) })}
                >
                    {problemManagementStore.nodesList.map(node =>
                        <option key={node.data.id} className='text-center' value={Number(node.data.id)}>{problemManagementStore.networkConfig.letter}{node.data.id}</option>
                    )}
                </select>
                <p className='mb-0 fs-4 me-4'><i className="bi bi-arrow-right"></i></p>
                <p className='mb-0 fs-4'><i className="bi bi-arrow-right"></i></p>
                <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1'
                    value={problemManagementStore.networkConfig.sink}
                    onChange={(e) => problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, sink: Number(e.target.value) })}
                >
                    {problemManagementStore.nodesList.map(node =>
                        <option key={node.data.id} className='text-center' value={Number(node.data.id)}>{problemManagementStore.networkConfig.letter}{node.data.id}</option>
                    )}
                </select>
            </div>
        </div>
    );
};

export default observer(SourceSinkSubpanel);