import { LightningElement,api,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class CustomFieldLWC extends LightningElement {
    @api recordId;
    @api fieldApiName;
    @api fieldLabel;
    @api objectApiName;

    fieldValue;

    @wire(getRecord, { recordId: '$recordId', fields: '$computedFieldApiName'})
        wiredRecord({ error, data }) {
            if (data) {
                this.error = undefined;
                const fieldData = data.fields[this.fieldApiName];
                console.log('Field Data---'+fieldData);
                this.fieldValue = fieldData?.value;
                //this.fieldLabel = fieldData?.Label;
            }else if(error){
                this.error = error;
            }
        }

    get computedFieldApiName(){
        return this.fieldApiName?[`${this.objectApiName}.${this.fieldApiName}`]:[];
    }
}