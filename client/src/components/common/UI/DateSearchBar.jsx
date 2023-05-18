import React from "react";

const DateSearchBar = ({ parametrs, setParametrs }) => {
    return (
        <div>
            <input type="date" className='rounded-4 p-2 sub-font-reg reg-font-color text-center mb-0'
                value={parametrs.dateQuery} onChange={(e) => setParametrs({ ...parametrs, dateQuery: e.target.value })} />
        </div>
    );
};

export default DateSearchBar;