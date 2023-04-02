import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import cl from '../../styles/MainUserPage.module.css'

const BannerItem = ({ body, buttonText, path }) => {
    return (
        <Col xl={4}>
            <div className={`rounded-4 ${cl.bannerItem} d-flex justify-content-center align-items-center flex-column p-4 main-border`}>
                <div>
                    <p className='sub-font-reg reg-font-color fs-6'>{body}</p>
                </div>
                <div className='w-100 mt-2 d-inline-flex justify-content-center'>
                    <Link to={path} replace className='main-font-bold text-black main-border'><i className="bi bi-arrow-right"></i>{buttonText}</Link>
                </div>
            </div>
        </Col>
    );
};

export default BannerItem;