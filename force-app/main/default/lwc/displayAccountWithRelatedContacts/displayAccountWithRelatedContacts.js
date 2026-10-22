import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountsWithRelatedContactsController.getAccounts';
import getContacts from '@salesforce/apex/AccountsWithRelatedContactsController.getContacts';
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class DisplayAccountWithRelatedContacts extends NavigationMixin(LightningElement) {

    selectedAccount = '';
    options = [];
    error='';
    contactData = [];
    columns = columns;
    contactResult;
    

    @wire(getAccounts)
    AccountsResult;


    @wire(getContacts, {AccountId:'$selectedAccount'})
    ContactResult(result){
        this.contactResult = result;
        if(result.data){
            this.contactData = result.data;
            this.error = null;
        }else{
            this.error = result.error;
            this.contactData = null;
        }

    }

    get AccountOptions() {
        return this.AccountsResult.data?.map(account => ({
            label:account.Name, 
            value:account.Id
        }))||[];
    }

    handleAccountChange(event){
        this.selectedAccount = event.detail.value;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'edit':
                this.editRow(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        deleteRecord(row.Id)
            .then(()=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Success',
                        message:'Contact deleted',
                        variant:'success'
                    })
                );
                return refreshApex(this.contactResult);
            })
            .catch(error=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Error deleting record',
                        message: error.body.message,
                        variant:'error'
                    })
                );
            });
            
    }

    editRow(row){
        const pageref = {
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'Contact',
                recordId: row.Id,
                actionName: 'edit'
            }
        }
        this[NavigationMixin.Navigate](pageref);
    }


}