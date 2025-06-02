const BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

const getConfig = async () => {
    const response = {
      success: true,
      data: null,
      error: null
    };
  
    try {
      const res = await fetch(`${BASE_URL}/config`, {
        method: "GET"
      });
  
      if (!res.ok) {
        response.success = false;
        response.error = `HTTP error! Status: ${res.status}`;
        console.error("Error fetching config. Status:", res.status);
        return response;
      }
  
      const data = await res.json();
      response.data = data;

      console.log("response.data",response)
    } catch (err) {
      response.success = false;
      response.error = err.message || "Unknown error";
      console.error("Fetch error:", err);
    }
  
    return response;
  };
  
  export { getConfig };
  