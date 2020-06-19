exports.handler = function(context, event, callback) {
 const client = context.getTwilioClient();
 
 const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
 
 //Create Survey Execution 
 client.studio.flows(context.SURVEY_STUDIO_FLOW_SID)
     .executions
     .create({ 
            to: event.To, 
            from: event.From,
            parameters : {
                ChannelSid : event.ChannelSid
            }
        })
        .then(execution => { 
            console.log(execution.sid);
            response.setStatusCode(204);
            callback(null, response);
        })
        .catch(err => {
            response.setStatusCode(500);
            response.setBody(err);
            callback(null,response)
        });
};