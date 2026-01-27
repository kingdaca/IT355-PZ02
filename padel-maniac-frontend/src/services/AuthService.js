import axios from "axios";

export default {

    async login(username,password){
       return await axios.post('http://localhost:8080/auth/login',{
            username,password
        })
    },

    async registration(formData){
            return await axios.post('http://localhost:8080/auth/registration', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
}