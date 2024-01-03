import { R3ClientWithoutAuth, R3Client } from "../clients/R3Client";

const login_endpoint = "jwt-auth/v1/token";
const getUser = (username, password) => {
  return R3ClientWithoutAuth.post(login_endpoint, 
    { 
      username: username, // "course@r3medicaltraining.com",
      password: password, //"e1234",
    }
  );
};

const getAdminUser = () => {
  return R3ClientWithoutAuth.post(login_endpoint, 
    { 
      username: "course@r3medicaltraining.com",
      password: "e1234",
    }
  );
};

const account_endpoint = "ps-event/v1/events/me/";
const getAccount = (user_id) => {
  return R3Client.get(`${account_endpoint}${user_id}`);
};

export { getUser, getAdminUser, getAccount };
