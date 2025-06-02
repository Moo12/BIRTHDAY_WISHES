import { ref } from "vue";
import useAuth from "./useAuth"

const useImage = () => {
    const pending = ref(false)

    const { user } = useAuth()

    const BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;


    async function UploadGeneralImage(file){
        const res = await UploadImageImp(file, "upload-site-image")
        return res
    }

    async function UploadImage(file, wishId){
        const append = []
        append.push({ argument: "wish_id", content: wishId})
        const res = await UploadImageImp(file, "upload", append)

        return res
    }

    async function UploadImageImp(file, endPoint, formDataAppend = null) {
        const formData = new FormData();
        formData.append("file", file);
        formDataAppend?.forEach(({ argument, content }) => {
            formData.append(argument, content);
        });
    
        pending.value = true;
      
        const token = await user.value.getIdToken();
      
        let response = {
          success: false,
          error_code: 0,
          url: "",
          status: null,
          message: "",
        };
      
        try {
          const res = await fetch(`${BASE_URL}/${endPoint}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
      
          response.status = res.status;
          response.error_code = res.status; // Always assign status as error_code
      
          if (!res.ok) {
            try {
                response.success = false
                const errData = await res.json();
                let errorMsg =
                typeof errData === "object" && "detail" in errData
                ? errData.detail
                : JSON.stringify(errData);
                
                console.error("errorMsg", errorMsg)
                response.error_code = errorMsg?.error_code
                response.message = errorMsg?.message
            } catch (parseError) {
                console.error(parseError)
                response.error_code = errData?.error_code
                
            }
          } else {
            const result = await res.json();
            response.success = true;
            response.url = result.url || "";
            response.message = "Upload successful";
          }
        } catch (err) {
          response.success = false;
          response.error_code = -1;
          response.message = `${err}`;
        }
      
        pending.value = false;
        return response;
    }

    async function deleteGeneralImage(file){
        const res = await deleteImageImp(file, "delete-site-image")
        return res
    }

    async function deleteImage(file, wishId){
        const append = []
        append.push({ argument: "wish_id", content: wishId})
        const res = await deleteImageImp(file, "delete-image", append)

        return res
    }
    const deleteImageImp = async (filename, endPoint, propertiesAppend = []) => {
        pending.value = true;
      
        const response = {
          success: true,
          error_code: 0,
          status: null,
          message: "",
        };
      
        // Ensure propertiesAppend is safe and append filename
        propertiesAppend.push({ argument: "filename", content: filename });
      
        // Build URL query parameters safely
        const params = new URLSearchParams();
        propertiesAppend.forEach(({ argument, content }) => {
          params.append(argument, content);
        });
      
        const token = await user.value.getIdToken();
      
        try {
          const res = await fetch(
            `${BASE_URL}/${endPoint}?${params.toString()}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          response.status = res.status;
      
          if (!res.ok) {
            response.success = false;
            const errData = await res.json();
            if (errData?.error_code) {
              response.error_code = errData.error_code;
              response.message = errData.message || "An error occurred";
            } else if (errData?.detail) {
              response.message = errData.detail;
            } else {
              response.message = JSON.stringify(errData);
            }
      
            console.error("Error deleting image:", response.message);
          } else {
            const result = await res.json();
            response.message = result?.message || "Delete successful";
            console.log("delete result:", result.message);
          }
      
        } catch (err) {
          response.success = false;
          response.error_code = "9999";
          response.message = "Unexpected error";
          console.error("Delete error:", err);
        }
      
        pending.value = false;
        return response;
    };
      

     return { pending, UploadImage, UploadGeneralImage, deleteImage, deleteGeneralImage}
}


  export default useImage