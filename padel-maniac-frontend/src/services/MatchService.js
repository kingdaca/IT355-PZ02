import api from "./httpIntercepter";
import axios from "axios";

export default {

    async createMatch(formData){
        return api.post("/match/create", formData)
    },

    async getMatches(){
        return api.get("/match/getMatches")
    }
}
