exports.handler = function(context, event, callback) {
 const client = context.getTwilioClient();
 let response = new Twilio.Response();

    // Add CORS Headers
    let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Content-Type": "application/json"
    };
    
 
 //Create Session
 client.proxy.services(context.PROXY_SERVICE_SID)
      .sessions
      .create({
         uniqueName: event.ChannelSid,
         mode: 'message-only',
         participants: [
            {
              identifier : event.ChannelSid, 
              proxyIdentifier : event.From
            }
        ]
       })
      .then(session => {
          //Add second participant
          client.proxy.services(context.PROXY_SERVICE_SID)
            .sessions(session.sid)
            .participants
            .create({
                identifier : event.To, 
                proxyIdentifier : event.From
            })
            .then(participant => {
                response.setStatusCode(204);
                callback(null,response);
            });
            
      })
      .catch(err => {
          response.setStatusCode(500);
          response.setBody(err);
          callback(null,err);
      });
};