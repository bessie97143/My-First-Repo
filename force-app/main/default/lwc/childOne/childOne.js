import { LightningElement, api } from 'lwc';

export default class ChildOne extends LightningElement {
    buttonBrand = 'success';
    @api buttonLabel = 'Select';

    @api childName = 'ChildOne';

    @api childReset(){
        this.buttonBrand = 'success';
        this.buttonLabel = 'Select';
    }

    handleClick(event){

        const event1 = new CustomEvent('childclick',
            {
                bubbles: true,
                composed: true,
                detail: this.buttonLabel
            });
        this.dispatchEvent(event1);

        if(this.buttonLabel==='Select'){
            this.buttonBrand = 'destructive';
            this.buttonLabel = 'Deselect';
        }
        else{
            this.buttonBrand = 'success';
            this.buttonLabel = 'Select';
        }
    }
}