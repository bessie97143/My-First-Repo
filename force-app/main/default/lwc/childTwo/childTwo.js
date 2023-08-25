import { LightningElement, api } from 'lwc';

export default class ChildTwo extends LightningElement {
    buttonBrand = 'success';
    @api buttonLabel = 'Select';

    @api childName = 'ChildTwo';

    @api childReset(){
        this.buttonBrand = 'success';
        this.buttonLabel = 'Select';
    }

    handleClick(event){

        const event2 = new CustomEvent('childclick',
            {
                bubbles: true,
                composed: true,
                detail: this.buttonLabel
            });
        this.dispatchEvent(event2);

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