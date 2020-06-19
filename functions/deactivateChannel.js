exports.handler = function(context, event, callback) {
    const client = context.getTwilioClient();
    
    let response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log(event);

    //Remove Channel Webhook
    client.chat.services(context.CHAT_SERVICE_SID)
        .channels(event.ChannelSid)
        .webhooks(event.WebhookSid)
        .remove();
    
    //Remove proxy session
    client.proxy.services(context.PROXY_SERVICE_SID)
        .sessions(event.SessionSid)
        .remove()
    
    //Fetch channel and deactivate it
    client.chat.services(context.CHAT_SERVICE_SID)
        .channels(event.ChannelSid)
        .fetch()
        .then(channel => {
            let attributes = JSON.parse(channel.attributes);
            attributes.status = "INACTIVE";
            
            client.chat.services(context.CHAT_SERVICE_SID)
                .channels(event.ChannelSid)
                .update({
                    attributes: attributes
                })
                .then(channel => {
                    response.setStatusCode(204);
                    callback(null,response);
                })
                .catch(err => {
                    response.setStatusCode(500);
                    response.setBody(err);
                    callback(null,response);
                });
        })
        .catch(err => {
            response.setStatusCode(500);
            response.setBody(err);
            callback(null,response);
        });
};