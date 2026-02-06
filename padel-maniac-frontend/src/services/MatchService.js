import api from "./httpIntercepter";
import axios from "axios";

export default {

    async createMatch(formData){
        return api.post("/match/create", formData)
    },

    async getMatches(){
        return api.get("/match/getMatches")
    },

    async joinToMatch(matchId, playerId){
        return api.post("/match/joinToMatch",{
            matchId : matchId,
            playerId : playerId
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async requestForMatch(matchId,userId){
        return api.post("/match/requestForMatch",
            {
                matchId : matchId,
                playerId : userId
            }
            ,{
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
        return api.post("/match/removeMatch", {matchId : matchId},{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async getUpcomingMatches(playerId){
        return api.post("/match/getUpcomingMatches",{playerId: playerId},{
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    async matchUnsubscribe(matchId, playerId) {
        return api.post(
            "/match/matchUnsubscribe",
            {
                matchId: matchId,
                playerId: playerId
            }
        );
    },

    async rejectRequest(matchId, playerId) {
        return api.post(
            "/match/rejectRequest",
            {
                matchId: matchId,
                playerId: playerId
            }
        );
    }


}
