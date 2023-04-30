import React from 'react';

const CustomTab = ({ label, activeTab, onClick }) => {
    return (
        <div
            className={`tab ${activeTab === label ? 'active-tab' : ''} w-50 text-center main-border p-2 main-font-bold`}
            onClick={() => onClick(label)}
        >
            {label}
        </div>
    );
};

export default CustomTab;