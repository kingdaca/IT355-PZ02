import api from "./httpIntercepter";
export default {

    async createOffer(CreatCourtOfferDTO){
       return  api.post("/offer/creatOffer",CreatCourtOfferDTO);
    },

    async getOffersByMatchId(matchId){
        return  api.post("/offer/getOffersByMatchId",matchId,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}