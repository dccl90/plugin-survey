import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'SurveyPlugin';

export default class SurveyPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);
    flex.Actions.addListener("afterCompleteTask",  payload => {
      const isChatTask = payload.task.taskChannelUniqueName === "sms" || 
        payload.task.taskChannelUniqueName === "chat";

      console.log("Is Chat Task: ", isChatTask);
      if(isChatTask){
        const data = { 
          From: payload.task.attributes.To,
          To: payload.task.attributes.From,
          ChannelSid : payload.task.attributes.channelSid
        };

        fetch('https://crimson-octopus-2455.twil.io/surveyExecution', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => {
          console.log("Response: ", response);
        })
        .catch(err => {
          console.log("Error: ", err);
        });
      }
    });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
