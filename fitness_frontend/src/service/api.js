import axios from "axios"

//  const API_URL="http://localhost:8080/api"

const API_URL = import.meta.env.VITE_API_URL;

const api=axios.create({
    baseURL:API_URL
});

api.interceptors.request.use((config)=>{
    // const userId=localStorage.getItem('userId');
    const token=localStorage.getItem('token');
    if(token){
        config.headers['Authorization']=`Bearer ${token}`;
    }
    // if(userId){
    //     config.headers['X-User-Id']=userId;
    // }

    return config;
});

export const getActivities=()=> api.get('/api/activities');
export const addActivity=(activity)=> api.post('/api/activities',activity);
export const getActivityDetail=(id)=> api.get(`/api/recommendations/activity/${id}`);

