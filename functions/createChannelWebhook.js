exports.handler = function(context, event, callback) {
 const client = context.getTwilioClient();
 let response = new Twilio.Response();

    // Add CORS Headers
    let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Content-Type": "application/json"
    };
    
    //Add studio webhook to channel
    client.chat.services(context.CHAT_SERVICE_SID)
        .channels(event.ChannelSid)
        .webhooks
        .create({
            type : "studio",
            configuration : {
                flowSid : context.SURVEY_STUDIO_FLOW_SID
            }
        })
        .then(webhook => {
            response.setStatusCode(204);
            callback(null,response);
        })
        .catch(err => {
            response.setStatusCode(500);
            response.setBody(err);
            callback(null, response);
        });
};