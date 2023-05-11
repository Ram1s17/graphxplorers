import React, { useState, useEffect } from "react";
import cl from "../../../styles/QuestionManagementPage.module.css"

const TypeFilterBar = ({ parametrs, setParametrs }) => {
    const [isFilterActive, setIsFilterActive] = useState({ theory: 'filter', interactive: 'filter' });

    useEffect(() => {
        if (parametrs.filterTheory && parametrs.filterInteractive) {
            setIsFilterActive({ theory: 'filter-active', interactive: 'filter-active' });
        }
        else if (parametrs.filterTheory) {
            setIsFilterActive({ theory: 'filter-active', interactive: 'filter' });
        }
        else if (parametrs.filterInteractive) {
            setIsFilterActive({ theory: 'filter', interactive: 'filter-active' });
        }
        else {
            setIsFilterActive({ theory: 'filter', interactive: 'filter' });
        }
    }, [parametrs.filterTheory, parametrs.filterInteractive]);

    return (
        <div className='d-flex justify-content-between align-items-center'>
            <p className='mb-0 me-2 text-black'>Фильтровать: </p>
            <div className={`d-flex align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1 me-2 ${isFilterActive.theory}`}
                onClick={() => setParametrs({ ...parametrs, filterTheory: !parametrs.filterTheory })}>
                <p className='mb-0 sub-font-reg text-black'>теоретические <i className="bi bi-journal-bookmark-fill fs-5"></i></p>
            </div>
            <div className={`d-flex align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1 me-2 ${isFilterActive.interactive}`}
                onClick={() => setParametrs({ ...parametrs, filterInteractive: !parametrs.filterInteractive })}>
                <p className='mb-0 sub-font-reg text-black'>интерактивные <i className="bi bi-joystick fs-5"></i></p>
            </div>
            <div className={`${cl.resetFilterButton} fs-5`} onClick={() => setParametrs({ ...parametrs, filterTheory: false, filterInteractive: false })}><i className="bi bi-x-circle"></i></div>
        </div>
    );
};

export default TypeFilterBar;