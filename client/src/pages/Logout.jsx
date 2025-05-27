import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
  const navigate = useNavigate();
  useEffect(()=> {
    navigate("/login")
  }, [])
  return (
    <div>
      <h1 className="mt-24">Redirecting to Login page..</h1>
    </div>
  );
}
