import React, { useState, useEffect } from "react";
import { isLoggedIn, getCurrentUser } from "../functions/auth";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [CourseDetails, setCourseDetails] = useState([]);
  const [CurrentUser, setCurrentUser] = useState({});
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [Token, setToken] = useState(null);
  const [TotalCartItems, setTotalCartItems] = useState(0);

  const isLoggedInUpdate = async () => {
    if(await isLoggedIn()){
      setIsLoggedIn(true);
      let currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
      setToken(currentUser.token || null);
    }
  }

  useEffect( () => {
    isLoggedInUpdate()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        CurrentUser: CurrentUser,
        setCurrentUser: setCurrentUser,
        IsLoggedIn: IsLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        Token: Token,
        setToken: setToken,
        CourseDetails: CourseDetails,
        setCourseDetails: setCourseDetails,
        TotalCartItems: TotalCartItems,
        setTotalCartItems: setTotalCartItems,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
