import api from "./httpIntercepter";

export default {

    async login(username,password){
       return await api.post('http://localhost:8080/auth/login',{
            username,password
        })
    },

    async registration(formData){
            return await api.post('http://localhost:8080/auth/registration', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
}