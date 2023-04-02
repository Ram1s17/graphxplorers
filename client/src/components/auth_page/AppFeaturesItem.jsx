import React from "react";

const AppFeaturesItem = ({ title, body, image }) => {
    return (
        <div className='feature-item-block main-border d-flex justify-content-center align-items-center rounded-4 mb-3'>
            <div className='img-block d-flex justify-content-center align-items-center'>
                <img src={image} alt={title} />
            </div>
            <div className='info-block'>
                <h2 className='main-font-bold'>{title}</h2>
                <p className="reg-font-color">{body}</p>
            </div>
        </div>
    );
};

export default AppFeaturesItem;