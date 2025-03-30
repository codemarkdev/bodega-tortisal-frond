import axios from "axios";

const apiRequest = async ({ method, path, data = {} , responseType = 'json' }) => {
  try {
    const headers = {
      'Content-Type': responseType === 'json' ? 'application/json' : 'application/pdf',
      'Accept': responseType === 'json' ? 'application/json' : 'application/pdf',
    };

    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BACK_URL}${path}`,
      data,
      headers,
      responseType: responseType === 'json' ? 'json' : 'blob' 
    });

    return response;
  } catch (error) {
    console.error("Error en la petición API:", {
      mensaje: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    return error.response || error;
  }
};

export default apiRequest;