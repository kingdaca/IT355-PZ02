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
    },

    async vote(RequestOfferVoteDTO){
        return api.post("/offer/vote",RequestOfferVoteDTO,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}