import axiosClient from "./axiosClient";

export async function loginaction(email,password){
     try {
          console.log(email,password);
          
           const res = await axiosClient.post('/auth/login',{
          email,
          password,
     })

     console.log(res);
     

     return res;
     } catch (error) {
          console.log(error);
          
     }
    
}