import React, { useEffect } from "react"
import AllRoutes from "./Routes/Route"
import { useDispatch } from "react-redux";
import { setAccessToken } from "./store/authSlice";
import { TOKEN_NAME } from "./constant/localStorageKeys";


const App: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAccessToken(localStorage.getItem(TOKEN_NAME) || ""));
  }, [dispatch]);
  return (
    <AllRoutes />
  )
}

export default App