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
    },


    async getOffersForCourt(playerId){
        return api.post("/offer/getOffersForCourt", { playerId: playerId },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async cancelOffer(offerId){
        return api.post("/offer/cancelOffer", {offerId : offerId} );
    },


    async confirmOffer(offerId){
        return api.post("/offer/confirmOffer", {offerId : offerId} );
    }


}