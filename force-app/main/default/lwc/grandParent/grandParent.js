import { LightningElement } from 'lwc';

export default class GrandParent extends LightningElement {

    noOfSelectedChilds = 0;

    handleChildClick(event){
        this.noOfSellectedChilds = event.detail === 'Select' ? this.noOfSelectedChilds++: this.noOfSelectedChilds--;
    }

    handleClick(event){
        this.noOfSelectedChilds = 0;
        this.template.querySelector('c-parent').parentReset();
    }

}