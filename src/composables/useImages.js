import { ref } from "vue";
import useAuth from "./useAuth"

const useImage = () => {
    const pending = ref(false)

    const { user } = useAuth()

    async function UploadGeneralSiteImage(file){
        const res = await UploadImageImp(file, "upload_site_image")
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
          const res = await fetch(`http://127.0.0.1:8080/${endPoint}`, {
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

     const deleteImage = async (filename, wishId = null) => {

        pending.value = true
        
        let response = {
            success: true,
            error_code: 0,
            status: null,
            message: "",
        };

        const token = await user.value.getIdToken();
    
        try {
            const BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

            const wishIdUrl = wishId ? `&wish_id=${encodeURIComponent(wishId)}` : ""
            const res = await fetch(
                `${BASE_URL}/delete-image?filename=${encodeURIComponent(filename)}${wishIdUrl}`,
                {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

          response.status = res.status;
    
          if (!res.ok) {
            response.success = false
            const errData = await res.json();
            let errorMsg =
            typeof errData === "object" && "detail" in errData
            ? errData.detail
            : JSON.stringify(errData);
            
            response.error_code = errorMsg?.error_code
            response.message = errorMsg?.message

            console.error("errorMsg", errorMsg)
          }
          else{
              const result = await res.json();
              response.success = true;
              response.message = "Delete successful";
              console.log("delete result:", result.message);
          }
    
        } catch (err) {
            response.success = false
            response.error_code = "9999"
            response.message = "unexpected error";

            console.error("Delete error:", err);
        }

        pending.value = false
        return response
      };


     return { pending, UploadImage, deleteImage}
}


  export default useImage