import api from "./httpIntercepter";

export default {

    async getNotifications(playerId){
        return api.post("/notification/getNotificationsForUser", {playerId:playerId},{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
}