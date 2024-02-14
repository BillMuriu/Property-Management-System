import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';

const PrivateRoutes = ({ allowedRoles }) => {
  // const { isAuthenticated, isAdmin, isEditor, isViewer, isLandlord } = useContext(AuthContext);

  const isAuthenticated = true 
  const isAdmin = true
  const isEditor = false
  const isViewer = false 
  const isLandlord = false

  const isAllowed = isAuthenticated && allowedRoles.some(role => {
    if (role === 'admin') {
        return isAdmin;
    } else if (role === 'editor') {
        return isEditor;
    } else if (role === 'viewer') {
        return isViewer;
    } else if (role === 'landlord') {
        return isLandlord;
    } else {
        return false;
    }
});

  // Render the child routes using Outlet if the user's role is allowed
  // Otherwise, navigate to the unauthorized page or the login page
  return isAllowed ? <Outlet /> : (
    isAuthenticated ? <Navigate to="/unauthorized" /> : <Navigate to="/login" />
  );
};

export default PrivateRoutes;
