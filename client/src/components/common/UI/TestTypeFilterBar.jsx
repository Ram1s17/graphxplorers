import React, { useMemo } from "react";

const TestTypeFilterBar = ({ parametrs, setParametrs }) => {
    const options = useMemo(() => {
        return [
            { label: 'Вид теста:', value: '' },
            { label: 'теоретический', value: 'theoretical' },
            { label: 'интерактивный', value: 'interactive' },
            { label: 'общий', value: 'mix' }
        ];
    }, []);

    return (
        <div>
            <select className='rounded-4 main-border px-3 py-2'
                value={parametrs.filter} onChange={(e) => setParametrs({ ...parametrs, filter: e.target.value })}>
                {options.map((option) =>
                    <option key={option.label} className='text-center' value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    );
};

export default TestTypeFilterBar;