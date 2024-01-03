import { storeData, storeDataJSON, getData, getDataJSON, removeData } from "../functions/AsyncStorageFunctions";

const isLoggedIn = async () => { 
    try {
        if(await getData("isLoggedIn") == "true"){
            return true;
        }
        return false;
    } catch (error) {
        alert(error);
        return false;
    }
};

const getCurrentUser = async () => { 
    try {
        return getDataJSON("currentUser") || {}
    } catch (error) {
        alert(error);
    }
};

const loginInStorage = async (user) => { 
    try {
        await storeDataJSON("currentUser", user);
        await storeData("token", user.token || "");
        await storeData("isLoggedIn", "true"); // store only string
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const doLogin = async (user, auth, props) => {
    if(await loginInStorage(user)){
        auth.setIsLoggedIn(true)
        auth.setCurrentUser(user)
        auth.setToken(user.token || null)
        alert("Logged in successfully");
        props.navigation.navigate("Home");
    }
}; 

const logoutFromStorage = async () => { 
    try {
        await removeData("isLoggedIn");
        await removeData("token");
        await removeData("currentUser");
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const doLogout = async (auth, props) => {
    if(await logoutFromStorage()){
      auth.setIsLoggedIn(false)
      auth.setCurrentUser({})
      auth.setToken(null)
      alert("Logout successfully.");
      props.navigation.navigate("Welcome");
    }
}; 

const setAdminToken = async (auth, user) => {
    try {
        storeData("token", user.token || "");
        auth.setToken(user.token || null);
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};


export { isLoggedIn, getCurrentUser, doLogin, doLogout, setAdminToken };