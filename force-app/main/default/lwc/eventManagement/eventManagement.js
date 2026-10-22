import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class EventManagement extends LightningElement {
    buttonClicked;
    displayMessage;
    urlParams = {};
    @api welcomeText = 'Hello Everyone, I am the event management component';

    // To fetch parameters from the url
    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        if (pageReference) {
            this.urlParams = pageReference.state;
        }
    }

    // To get p1 parameter from the urlParams
    get name() {
        return this.urlParams.name;
    }

    // To get p2 parameter from the urlParams
    get campaignid() {
        return this.urlParams.campaignid;
    }

    // To get p3 parameter from the urlParams
    get contactid() {
        return this.urlParams.contactid;
    }
    
    handleClick(e) {
        console.log('p1'+this.name);
        this.buttonClicked = e.target.label;
        if (this.buttonClicked === 'Accept') {
            this.displayMessage = 'Thank you for accepting the invitation'+this.name;
            //this.template.querySelector('.slds-text-heading_large').style.color = 'green';
        } else if (this.buttonClicked === 'Reject') {
            this.displayMessage = 'Oh we miss you in the event.';
            //this.template.querySelector('.slds-text-heading_large').style.color = 'red';
        } else {
            this.displayMessage = 'An error occurred.';
        }
    }
}