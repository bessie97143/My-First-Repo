import { LightningElement } from 'lwc';

export default class SimpleCalculator extends LightningElement {
    
    calcExpression = '';
    calResult = 0;
    displayResult = 0;
    currOperation = '';
    prevOperation = '';
    number = 0;
    nbrStr = '';
    operatorAsLast = false;
    operators = ['+', '-', '*', '/', '='];
    equalClicked = false;

    performCalculation() {
        if (this.calResult == 'NAN') {
            return;
        }
        if (this.prevOperation === '+') {
            this.calResult += this.number;
        }
        if (this.prevOperation === '-') {
            this.calResult -= this.number;
        }
        if (this.prevOperation === '*') {
            this.calResult *= this.number;
        }
        if (this.prevOperation === '/') {
            this.calResult /= this.number;
        }

    }
    resetAll(){
        this.calcExpression = '';
        this.calResult = 0;
        this.displayResult = 0;
        this.currOperation = '';
        this.prevOperation = '';
        this.number = 0;
        this.nbrStr = '';
        this.operatorAsLast = false;
        this.equalClicked = false;
    }

    handleClick(event) {
        if (event.target.label === 'CLR') {
            this.resetAll();
        }
        else if (event.target.label === '=') {
            this.equalClicked = true;
            this.number = parseInt(this.nbrStr);
            this.performCalculation();
            this.prevOperation = '';
            this.displayResult = this.calResult;
            return;
        }
        else {
            this.calcExpression += event.target.label;
            if (this.operators.includes(event.target.label)) {
                this.equalClicked = false;
                if (this.operatorAsLast) {
                    this.calResult = 'NAN';
                    return;
                }
                this.currOperation = event.target.label;
                this.number = parseInt(this.nbrStr);
                this.nbrStr = '';
                if (this.prevOperation !== '') {
                    this.performCalculation();
                }
                else if (this.prevOperation == '' && this.calResult == 0) {
                    this.calResult = this.number;
                }
                this.operatorAsLast = true;
            }
            else {
                if(this.equalClicked){
                    this.resetAll();
                    this.calcExpression += event.target.label;
                }
                this.nbrStr = this.nbrStr + '' + event.target.label;
                this.operatorAsLast = false;
                if (this.currOperation !== '') {
                    this.prevOperation = this.currOperation;
                    this.currOperation = '';
                    return;
                }

            }
        }
    }

}
