import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountsWithRelatedContactsController.getAccounts';

const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Billing Country', fieldName: 'BillingCountry' }
];

export default class LwcPagination extends LightningElement {
    currentPage = 1;
    pageSize = 10;

    columns = columns;
    allAccounts = [];
    accountsData = [];

    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.allAccounts = data;
            this.updatePageData();
        } else if (error) {
            console.error(error);
        }
    }

    updatePageData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;

        this.accountsData = this.allAccounts.slice(start, end);
    }

    get totalPage() {
        return Math.ceil(this.allAccounts.length / this.pageSize);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePageData();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
            this.updatePageData();
        }
    }
}