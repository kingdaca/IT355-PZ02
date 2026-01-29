import api from "./httpIntercepter";
import axios from "axios";

export default {

    async getAllCities(){
        return await api.get("/city/cities");
    }
}

