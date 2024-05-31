import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
function NotAuthenticated({children}) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (user) {
        navigate("/", {replace: true})
        return null
    }
  return children;
}

export default NotAuthenticated