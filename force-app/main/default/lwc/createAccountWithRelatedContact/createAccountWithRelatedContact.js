import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {createRecord} from 'lightning/uiRecordApi';


export default class CreateAccountWithRelatedContact extends LightningElement {

    accountRecordTypeId;
    industryOptions;
    error;
    accountName;
    industry;
    lastName;
    email;

    @wire(getObjectInfo,{objectApiName : ACCOUNT_OBJECT})
    results({ error, data }) {
        if (data) {
        this.accountRecordTypeId = data.defaultRecordTypeId;
        this.error = undefined;
        } else if (error) {
        this.error = error;
        this.accountRecordTypeId = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: "$accountRecordTypeId", fieldApiName: INDUSTRY_FIELD })
    picklistResults({ error, data }) {
        if (data) {
        this.industryOptions = data.values;
        this.error = undefined;
        } else if (error) {
        this.error = error;
        this.industryOptions = undefined;
        }
    }

    handleInputChange(event){
        const field = event.target.name;
        const value = event.target.value;
        this[field] = value;
    }

    handleComboBoxChange(event){
        const field = event.target.name;
        const value = event.detail.value;
        this[field] = value;
    }
    
    handleCreateRecords(){
        let isValid = this.validateUserInput();
        if(isValid){
            console.log('Validation Successfull');
            this.CreateRecords();
        }else{
            console.log('Validation Failed');
        }
    }

    validateUserInput(){
        let elements = this.template.querySelectorAll("lightning-input");
        let isValid = true;
        elements.forEach(currItem =>{
            if(!currItem.checkValidity()){
                isValid = false;
                currItem.reportValidity();
            }
        });
        let contactElement = this.template.querySelector(".contactLastName")
        if(this.lastName === this.accountName){
            console.log('Last Name should not be same as the Account Name');
            contactElement.setCustomValidity("Last Name should not be same as the Account Name");
            isValid = false;
        }else{
            contactElement.setCustomValidity("");
        }
        contactElement.reportValidity();

        let contactEmailElement = this.template.querySelector(".contactEmail")
        if(!this.email.endsWith("@salesforce.com")){
            contactEmailElement.setCustomValidity("Please enter valid emailId");
            isValid = false;
        }else{
            contactEmailElement.setCustomValidity("");
        }
        contactEmailElement.reportValidity();

        return isValid;
    }


    async CreateRecords(){
        try{
            const accountFields = {};
            accountFields[ACCOUNT_NAME_FIELD.fieldApiName] = this.accountName;
            accountFields[INDUSTRY_FIELD.fieldApiName] = this.industry;
            const accountRecord = await createRecord({
                apiName: ACCOUNT_OBJECT.objectApiName,
                fields: accountFields
            })

            const contactFields = {};
            contactFields[LAST_NAME_FIELD.fieldApiName] = this.lastName;
            contactFields[EMAIL_FIELD.fieldApiName] = this.email;
            const contactRecord = await createRecord({
                apiName: CONTACT_OBJECT.objectApiName,
                fields: contactFields
            })
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Success',
                    message:'Contact deleted',
                    variant:'success'
                })
            );
        }catch(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error deleting record',
                    message: error.body.message,
                    variant:'error'
                })
            );
        }
        
    }
}