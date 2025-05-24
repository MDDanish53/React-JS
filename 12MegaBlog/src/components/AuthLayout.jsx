//Authentication Layout - it is a mechanism of protecting pages or routes 

import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

// we will conditionally render that to render its children or not
export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    //asking to authStatus(store) that you are logged in or not
    const authStatus = useSelector(state => state.auth.status)

    //useEffect tells us that we have to send to login, home and check according to field change or not
    useEffect(() => {
        if(authentication && authStatus !== authentication) {
            navigate('/login')
        } else if(!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])
    
    return loader ? <h1>Loading...</h1> : <>{children}</>
}