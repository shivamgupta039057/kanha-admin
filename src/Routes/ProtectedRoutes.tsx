import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageKeys, { TOKEN_NAME } from '../constant/localStorageKeys';
import { ROUTES_CONST } from '../constant/routeConstant';

interface ProtectedProps {
  Component: React.ComponentType;
}

const Protected: React.FC<ProtectedProps> = (props) => {
  const {Component} = props  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_NAME);
    if (!token) {
      navigate(ROUTES_CONST.AUTH.SIGNIN);
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return isLoggedIn ? <Component /> : null;
};

export default Protected;
