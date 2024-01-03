import { create } from "apisauce";
import { getData } from "../functions/AsyncStorageFunctions";

const Config = {
  baseURL: "https://r3medicaltraining.com/api/wp-json/",
  timeout: 90000,
};

const R3ClientWithoutAuth = create(Config);
const R3Client = create(Config);

R3Client.addAsyncRequestTransform(request => async () => {
  const token = await getData("token") || null;
  if (!token) return;
  request.headers["Authorization"] = "Bearer " + token;
});

export { R3Client, R3ClientWithoutAuth };
