import React, { useMemo } from "react";

const SortBarWithoutLabel = ({ parametrs, setParametrs }) => {
    const options = useMemo(() => {
        return [
            { label: 'Сортировка решений:', value: '' },
            { label: 'по возрастанию баллов', value: 'up' },
            { label: 'по убыванию баллов', value: 'down' }
        ];
    }, []);

    return (
        <div>
            <select className='rounded-4 main-border px-3 py-2'
                value={parametrs.sort} onChange={(e) => setParametrs({ ...parametrs, sort: e.target.value })}>
                {options.map((option) =>
                    <option key={option.label} className='text-center' value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    );
};

export default SortBarWithoutLabel;