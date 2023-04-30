import React, { useState } from "react";
import CustomTab from "./CustomTab";

const CustomTabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    const onClickTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs">
            <div className='tab-list d-flex justify-content-center'>
                {children.map((child) => {
                    const { label } = child.props;
                    return (
                        <CustomTab
                            key={label}
                            label={label}
                            activeTab={activeTab}
                            onClick={onClickTab}
                        />
                    );
                })}
            </div>
            <div className="tab-content">
                {children.map((child) => {
                    if (child.props.label !== activeTab) return undefined;
                    return child.props.content;
                })}
            </div>
        </div>
    );
};

export default CustomTabs;