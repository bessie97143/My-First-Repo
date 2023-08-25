import { LightningElement, api } from 'lwc';

export default class Parent extends LightningElement {
    
    childOneSelect = 'Deselected';
    childTwoSelect = 'Deselected';
    childThreeSelect = 'Deselected';

    @api parentReset(){
        this.childOneSelect = 'Deselected';
        this.childTwoSelect = 'Deselected';
        this.childThreeSelect = 'Deselected';
        this.template.querySelector('c-child-one').childReset();
        this.template.querySelector('c-child-two').childReset();
        this.template.querySelector('c-child-three').childReset();
    }

    handleChildClick(event) {
        switch (event.target.childName) {
            case 'ChildOne':
                this.childOneSelect = event.target.buttonLabel === 'Select' ? 'Selected' : 'Deselected';
                break;
            case 'ChildTwo':
                this.childTwoSelect = event.target.buttonLabel === 'Select' ? 'Selected' : 'Deselected';
                break;
            case 'ChildThree':
                this.childThreeSelect = event.target.buttonLabel === 'Select' ? 'Selected' : 'Deselected';
                break;
        }
    }

}