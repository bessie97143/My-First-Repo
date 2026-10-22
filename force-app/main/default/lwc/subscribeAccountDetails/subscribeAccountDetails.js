import { LightningElement,api,wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNTDETAILMESSAGECHANNEL from '@salesforce/messageChannel/AccountDetailsMessagingChannel__c';

export default class SubscribeAccountDetails extends LightningElement {
    
    @api recordId;
    subscription = null;
    
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleMessage(message) {
        this.recordId = message.recordId;
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNTDETAILMESSAGECHANNEL,
            (message) => this.handleMessage(message)
        );
    }

}