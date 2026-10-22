import { LightningElement,wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import  getAccounts from '@salesforce/apex/DisplayAccountWithContactsController.getAccounts';
import deleteAccountWithNoOpp from '@salesforce/apex/DisplayAccountWithContactsController.deleteAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const columns = [
    { label: 'Account Name',
        fieldName: 'recordLink',
        type: 'url',
        typeAttributes: { label: { fieldName: 'Name' }, target: '_self' }},
    { label: 'Type', fieldName: 'Type' },
    { label: 'Billing Country', fieldName: 'BillingCountry', type: 'text' },
    { label: 'Total Opportunity', fieldName: 'OpportunityCount',type:'number', cellAttributes: { alignment: 'left' }},
    {
        type: 'button',
        typeAttributes: {
            label: 'Create Contact',
            name: 'createContact',
            title: 'Create Contact1',
            variant: 'brand',
            iconPosition: 'left'
        }
    },
    {
        type: 'button',
        typeAttributes: {
            label: 'Delete Account',
            name: 'deleteAccount',
            title: 'Delete Account',
            variant: 'destructive',
            iconPosition: 'left'
        }
    }
];

export default class DisplayAccountWithContacts extends NavigationMixin(LightningElement) {
    data = [];
    columns = columns;
    wiredAccountsResult;

    @wire(getAccounts)
    accountdata(result){
        this.wiredAccountsResult = result;
        if(result.data){
            this.data = result.data.map(acc => ({
                ...acc,
                recordLink: '/lightning/r/Account/' + acc.Id + '/view'
            }));
        }else if (result.error) {
            console.error('Error fetching accounts:', result.error);
        }
    }

    get isRecordsAvaiable(){
        console.log('Dispaly----'+(this.data && this.data.length > 0)? true : false );
        return (this.data && this.data.length > 0) ? true : false;
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch(actionName){
            case 'createContact':
                this.createContact(row);
                break;
            case 'deleteAccount':
                this.deleteAccount(row);
                break;
        }
    }

    createContact(row){
        const defaultValues = encodeDefaultFieldValues({
            AccountId:row.Id
            })
        const pageref = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues : defaultValues,
                nooverride: '1'
            }
        }
        this[NavigationMixin.Navigate](pageref);
    }

    async deleteAccount(row){
        console.log('Delete Contact Clicked');
        try{
            await deleteAccountWithNoOpp({acctId:row.Id});
            this.showToast('Success','Account Deleted Successfully','success');
            await refreshApex(this.wiredAccountsResult);
        }
        catch(error){
            this.showToast('error',error.body.message,'error');
        }
    }

    showToast(inpTitle,inpMessage,inpVariant) {
        const event = new ShowToastEvent({
            title: inpTitle,
            message: inpMessage,
            variant: inpVariant
        });
        this.dispatchEvent(event);
    }
}