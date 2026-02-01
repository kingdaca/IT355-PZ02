import api from "./httpIntercepter";
export default {

    async createOffer(CreatCourtOfferDTO){
       return  api.post("/offer/creatOffer",CreatCourtOfferDTO);
    }

}