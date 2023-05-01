import React from "react";

const SearchBar = ({ parametrs, setParametrs }) => {
    return (
        <div>
            <input type='search' placeholder='Поиск...' className='w-100 rounded-4 p-2 sub-font-reg reg-font-color text-center mb-0'
                value={parametrs.query} onChange={(e) => setParametrs({ ...parametrs, query: e.target.value })} />
        </div>
    );
};

export default SearchBar;