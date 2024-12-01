import React, { useEffect, useState } from 'react'
import useDebouncedState from '../hooks/useDebouncedState';

function TypeAhead() {
    
    const STATE = {
        LOADING: 'LOADING',
        ERROR: 'ERROR',
        SUCCESS: 'SUCCESS'
    }

    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState(STATE.LOADING);
    const [debouncedState, setDebouncedState] = useDebouncedState("", 3000); // debounced state, used in api call

    async function fetchData(url) {
        try {
            setStatus(STATE.LOADING);
            const response = await fetch(url);
            const result = await response.json();
            setStatus(STATE.SUCCESS);
            setData(result);
        } catch (error) {
            setStatus(STATE.ERROR);
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData(`https://dummyjson.com/products/search?q=${debouncedState}&limit=10`);
    }, [debouncedState])

    const handleChange = (e) => {
        setQuery(e.target.value); // Update input state immediately
        setDebouncedState(e.target.value); // Update debounced state
    };

    return (
        <div>
            <input 
                type="text"
                value={query}
                onChange={handleChange}
            />
            {status === STATE.LOADING && <div>...Loading</div>}
            {status === STATE.ERROR && <div>Error occured</div>}
            {status === STATE.SUCCESS && (
            <ul>
                {data.products.map((it) => {
                    return <li key={it.id}>{it.title}</li>
                })}
            </ul>
            )}
        </div>
    )
}

export default TypeAhead