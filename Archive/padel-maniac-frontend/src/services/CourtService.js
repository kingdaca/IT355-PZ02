import api from "./httpIntercepter";
export default {

    async getCourts(){
        return await api.get("/court/getCourts");
    }
}