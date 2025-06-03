import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const nav = useNavigate()
    useEffect(() => {
        nav("/login")
    }, [])

}

export default LandingPage