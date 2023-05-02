import React, { useMemo } from "react";

const SortBar = ({ parametrs, setParametrs }) => {
    const options = useMemo(() => {
        return [
            { label: '-', value: '' },
            { label: 'по возрастанию баллов', value: 'up' },
            { label: 'по убыванию баллов', value: 'down' }
        ];
    }, []);

    return (
        <div className='d-flex justify-content-between align-items-center'>
            <p className='mb-0 me-2 text-black'>Сортировать: </p>
            <select className='rounded-4 main-border ps-3 pe-3 pt-2 pb-2'
                value={parametrs.sort} onChange={(e) => setParametrs({ ...parametrs, sort: e.target.value })}>
                {options.map((option) =>
                    <option key={option.label} className='text-center' value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    );
};

export default SortBar;