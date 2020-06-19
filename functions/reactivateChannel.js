exports.handler = function(context, event, callback) {
 const client = context.getTwilioClient();
 let response = new Twilio.Response();

    // Add CORS Headers
    let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Content-Type": "application/json"
    };
    
    console.log(event)
    
    // Set headers in response
    response.setHeaders(headers);
    
    //Fetch Channel
    client.chat.services(context.CHAT_SERVICE_SID)
        .channels(event.ChannelSid)
        .fetch()
        .then(channel => {
            //Update channel attributes and set the status to active
            let attributes = JSON.parse(channel.attributes)
            attributes.status = "ACTIVE";
            client.chat.services(context.CHAT_SERVICE_SID)
                .channels(event.ChannelSid)
                .update({
                    attributes : JSON.stringify(attributes)
                })
                .then(channel => {
                    response.setStatusCode(200);
                    response.setBody({
                        Channel: channel.sid,
                        Status: "Active"
                    })
                    callback(null,response);
                })
                .catch(err => {
                    response.setStatusCode(500);
                    response.setBody(err);
                    console.log(err)
                    callback(null,response);
                });
        })
        .catch(err => {
            console.log(err)
            response.setStatusCode(500);
            response.setBody(err);
            callback(null,response);
        })
};