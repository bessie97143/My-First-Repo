import { wire,LightningElement } from 'lwc';
import getCalendarRecords from '@salesforce/apex/QLOfferCatalogueCalendarController.getCalendarRecords1';


export default class OfferCatalogueCalendarContainer extends LightningElement {

    objectApiName = 'Offer_Catalogue__c';
    records;

    calendarConfig = {
        objectApiName: this.objectApiName,
        fields: [
                    'Id',
                    'Name',
                    'OfferStatus__c',
                    'Offer_Start_Date__c',
                    'Offer_End_Date__c'
                ],
        nameField:'Name',
        statusField:'OfferStatus__c',
        startDateField: 'Offer_Start_Date__c',
        endDateField: 'Offer_End_Date__c',
        filters: [
            {
                fieldApiName: 'OfferStatus__c',
                label: 'Offer Status',
                type:'picklist',
                options: [
                    { label: 'Draft', value: 'Draft' },
                    { label: 'Sales Review', value: 'Sales Review' },
                    { label: 'Revenue Dept', value: 'Revenue Dept' }
                ]

            },
            {
                fieldApiName: 'Offer_Type__c',
                label: 'Offer Type',
                type:'picklist'
            },
            {
                fieldApiName: 'Point_of_Sale_Country__c',
                label: 'Point of Sale (Country)',
                type: 'text'
            },
            {
                fieldApiName: 'Itinerary__c',
                label: 'Itinerary',
                type: 'text'
            }
        ]
    };


}