import React, { useState, useEffect } from "react";
import cl from '../../../styles/ProblemsListPage.module.css'

const FilterBar = ({ parametrs, setParametrs }) => {
    const [isFilterActive, setIsFilterActive] = useState({ easy: 'filter', hard: 'filter' });

    useEffect(() => {
        if (parametrs.filterEasy && parametrs.filterHard) {
            setIsFilterActive({ easy: 'filter-active', hard: 'filter-active' });
        }
        else if (parametrs.filterEasy) {
            setIsFilterActive({ easy: 'filter-active', hard: 'filter' });
        }
        else if (parametrs.filterHard) {
            setIsFilterActive({ easy: 'filter', hard: 'filter-active' });
        }
        else {
            setIsFilterActive({ easy: 'filter', hard: 'filter' });
        }
    }, [parametrs.filterEasy, parametrs.filterHard]);

    return (
        <div className='d-flex justify-content-between align-items-center'>
            <p className='mb-0 me-2 text-black'>Фильтровать: </p>
            <div className={`d-flex align-items-center rounded-4 main-border sub-font-reg text-black ps-4 pe-4 pt-1 pb-1 me-2 ${isFilterActive.easy}`}
                onClick={() => setParametrs({ ...parametrs, filterEasy: !parametrs.filterEasy })}>легкие <div className={`${cl.circle} rounded-circle color-3 main-border ms-1`} /></div>
            <div className={`d-flex align-items-center rounded-4 main-border sub-font-reg text-black ps-4 pe-4 pt-1 pb-1 me-2 ${isFilterActive.hard}`}
                onClick={() => setParametrs({ ...parametrs, filterHard: !parametrs.filterHard })}>сложные <div className={`${cl.circle} rounded-pill color-4 main-border ms-1`} /></div>
            <div className={`${cl.resetFilterButton} fs-5`} onClick={() => setParametrs({ ...parametrs, filterEasy: false, filterHard: false })}><i className="bi bi-x-circle"></i></div>
        </div>
    );
};

export default FilterBar;