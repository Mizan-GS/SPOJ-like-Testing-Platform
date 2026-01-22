import axios from "axios"

const axiosClient=axios.create({
     baseURL : "https://xc4fn4b4-8080.inc1.devtunnels.ms",
     headers:{
          "Content-Type" :"application/json"
     },
});

//*attach token automatically to every request

axiosClient.interceptors.request.use(
     (config)=>{
          const token = localStorage.getItem("token")

          if (token){
               config.headers.Authorization = `Bearer ${token}`
          }

          return config;
     },
     (error)=>{
          return Promise.reject(error)
     }
);

export default axiosClient;