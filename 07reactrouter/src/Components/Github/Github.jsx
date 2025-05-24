import React from 'react'
import {useEffect, useState} from 'react'
import {useLoaderData} from 'react-router-dom'

function Github() {
    const data = useLoaderData(); //calling the githubInfoLoader
    //const [data, setData] = useState([])
    
//useEffect is called when the Github component loads 
    // useEffect(() => {
    //     fetch("https://api.github.com/users/hiteshchoudhary")
    //     .then(response => response.json())
    //     .then(data => {
    //         setData(data);
    //     })
    // }, [])

    return (
        <div className="text-center m-5 bg-gray-600 text-white p-4 text-3xl">Github Followers : {data.followers}
        <img src={data.avatar_url} alt="Sir's Image" width={300} />
        </div>
    )
}

export default Github;

export const githubInfoLoader = async () => {
    const response = await fetch('https://api.github.com/users/hiteshchoudhary');
    return response.json(); //we can return a promise
} 

