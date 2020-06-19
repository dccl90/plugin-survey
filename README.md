# Your custom Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

Plugin and functions are for demonstration purposes only.

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd 

# If you use npm
npm install
```

## Add v1 Functions to Twilio

Add the functions from the functions directory to the Twilio Console:
https://www.twilio.com/console/functions/manage

Create the following environment variables:

* CHAT_SERVICE_SID = ISXXX
* PROXY_SERVICE_SID = ISXXX
* SURVEY_STUDIO_FLOW_SID = FWXXX

## Create the Studio Flow
The studio flow will have two triggers
* API Trigger
* Message Trigger

The API trigger is used to re-establish the messaging session.

API Trigger Setup:
* Connect Trigger to Run Function Widget.
* Reactivate_Channel Widget Configuration.
  * Link the reactivateChannel function
  * Add the following parameters:
    * Key: ChannelSid
    * Value: {{trigger.request.parameters.Channelsid}}
    * Key: To
    * Value: {{trigger.request.To}}
   * On success connect to run function widget
   
* Create_Channel_Webhook Widget Configuration
  * Link to createChannelWebhook function
  * Add the following parameters:
    * Key: ChannelSid
    * Value: {{trigger.request.parameters.ChannelSid}}
   * On success connect to run function widget
   
* Create_Session Widget Configuration
  * Link to createOutboundSession function
  * Add the following parameters:
    * Key: ChannelSid
    * Value: {{trigger.request.parameters.ChannelSid}}
    * Key: To
    * Value: {{trigger.request.To}}
    * Key: From
    * Value: {{trigger.request.From}}
   * On success connect to send and wait reply widget
   
 * Send and Wait Reply Widget Configuration
  * Add opt in message
  * Connect all transitions to run function widget
  
* Deactivate_Channel Widget Configuration
  * Link to deactivateChannel function
  * Add the following parameters:
    * Key: ChannelSid
    * Value: {{trigger.request.parameters.ChannelSid}}
    * Key: WeebhookSid
    * Value: {{widgets.Create_Channel_Webhook.body.parsed.WebhookSid}}
    * Key: SessionSid
    * Value: {{widgets.Create_Session.body.parsed.SessionSid}}
  * No further transition
  
The deactivate channel step is to prevent sessions from becoming stuck. Even though the reply transition will never occur we want to ensure when the session timer lapses the session and channel are cleaned up.

Messaging Trigger Setup:

* Connect Trigger to Split Based On Widget.
 * Target {{trigger.message.body}}
 * Add a transition to match if the message body contains "yes"
 * Connect the condition match transition to a send and wait reply widget
 * Connect the no condition match to a run function widget pointing to the deactivateChannel function.

* CSAT_Question (Send and wait reply widget)
 * Message body - Prompt user to rate the service
 * Reply transition, you can define your own I would reccomend the following guide to ensure the data is added to Flex Insights
  * https://www.twilio.com/blog/post-task-surveys-with-flex-insights
    
 

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
