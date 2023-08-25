import { LightningElement, api } from 'lwc';

export default class ChildThree extends LightningElement {
    buttonBrand = 'success';
    @api buttonLabel = 'Select';

    @api childName = 'ChildThree';

    @api childReset(){
        this.buttonBrand = 'success';
        this.buttonLabel = 'Select';
    }

    handleClick(event){

        const event3 = new CustomEvent('childclick',
            {
                bubbles: true,
                composed: true,
                detail: this.buttonLabel
            });
        this.dispatchEvent(event3);

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