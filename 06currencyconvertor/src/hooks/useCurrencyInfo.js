import {useEffect, useState} from 'react'

//designing custom hooks
//here we are returning the entire method i.e. useCurrencyInfo
function useCurrencyInfo(currency) {
    const [data, setData] = useState({}); //empty object if no value comes then we can apply loops on this object and it will not crash

    useEffect(() => {
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then((res) => res.json())
        .then((res) => 
            setData(res[currency]));
    }, [currency]);
    return data;
}

export default useCurrencyInfo;