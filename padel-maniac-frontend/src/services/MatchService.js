import api from "./httpIntercepter";
import axios from "axios";

export default {

    async createMatch(formData){
        return api.post("/match/create", formData)
    },

    async getMatches(){
        return api.get("/match/getMatches")
    },

    async joinToMatch(matchId){
        return api.post("/match/joinToMatch", matchId,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async mathcDetails(matchId){
        return api.post("/match/matchDetails", matchId,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async removeMatch(matchId){
        return api.post("/match/removeMatch", matchId,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },


}
