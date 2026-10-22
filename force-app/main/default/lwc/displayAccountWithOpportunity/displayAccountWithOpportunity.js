import { LightningElement, wire } from 'lwc';
import getAccountWithOpportunity from '@salesforce/apex/DisplayAccountWithOppController.getAccountWithOpportunity';
import { publish, MessageContext } from "lightning/messageService";
import ACCOUNTDETAILMESSAGECHANNEL from '@salesforce/messageChannel/AccountDetailsMessagingChannel__c';

const columns = [
    { label: 'Account Name', fieldName: 'AcctUrl',type:'url',
         typeAttributes: { label: { fieldName: 'AcctName' }, target: '_self' }
    },
    { label: 'Type', fieldName: 'AcctType' },
    { label: 'Billing Country', fieldName: 'AcctBillingCountry' },
    { label: 'Total Opportunities', fieldName: 'TotalOpp'},
];

export default class DisplayAccountWithOpportunity extends LightningElement {

    accountWithOpportunities;
    accountdata = [];
    columns = columns;
    error = '';
    selectedAccountId;

    @wire(MessageContext)
    messageContext;
    

    @wire(getAccountWithOpportunity)
    getAccountWithOpportunities(result){
        this.accountWithOpportunities = result;
        if(result.data){
            this.accountdata = result.data;
            this.error = null;
        }else{
            this.error = result.error;
            this.accountdata = null;
        }
        console.log('data'+this.accountData);
        console.log('Error'+this.error);
    }

    hanldeRowSelection(event){
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            this.selectedAccountId = selectedRows[0].AcctId;
        }
        const payload = { recordId: this.selectedAccountId };
        publish(this.messageContext, ACCOUNTDETAILMESSAGECHANNEL, payload);
    }

}