import { useContext, useEffect } from "react"
import { AppContext } from "./App"
import { useNavigate } from "react-router-dom"




export default function ProtectedRoute({ children, allowedRoles }) {
  
  const {user}=useContext(AppContext)
  const navigate=useNavigate()
  useEffect(() => {
    
      if (!user) {
        // User is not authenticated, redirect to login
       navigate("/login")
      } }
  , [user, allowedRoles])

  // Show loading spinner while checking authentication
  

  // If user is not authenticated or doesn't have permission, show nothing
  // (will be redirected by the useEffect)
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    )
  }

  // User is authenticated and authorized
  return <>{children}</>
}