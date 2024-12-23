import axios from "axios";

type headersProps = {
  "Content-type": string;
};

type configProps = {
  url: string;
  method: string;
  headers: headersProps;
  data: object | null | undefined;
  params: object | null | undefined;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_BACK_API_URL,
  withCredentials: true,
});

const apiCall = async (
  url: string,
  method = "get",
  data: null | undefined | object = null
) => {
  try {
    const headers: headersProps = {
      "Content-type": "application/json",
    };
    const config: configProps = {
      url,
      method,
      headers,
      data: {},
      params: {},
    };
    if (method.toLowerCase() === "get") {
      config.params = data;
    } else {
      config.data = data;
    }
    const response = await API(config);
    return response;
  } catch (error) {
    console.log("API call error", error);
    throw error;
  }
};

export default apiCall;
