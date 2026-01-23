
export function decodeJwt(token){
     try {
          const payload = token.split('.')[1];
          if(!payload)
               return null;

          return JSON.parse(atob(payload));
     } catch (error) {
          return null
     }
}


export function isTokenExpired(token){
     if (!token)
          return null;

     const decoded = decodeJwt(token);
     if (!decoded || !decoded.exp) 
          return true;

     const expiryTime = decoded.exp * 1000; //seconds->ms
     return Date.now()>=expiryTime;
}