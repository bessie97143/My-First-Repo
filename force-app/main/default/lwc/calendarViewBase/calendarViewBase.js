import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType  } from 'lightning/uiObjectInfoApi';
import { NavigationMixin } from 'lightning/navigation';
import getCalendarRecords from '@salesforce/apex/QLOfferCatalogueCalendarController.getCalendarRecords';
const statusClassMap = {
    'Draft': 'status-draft',
    'Sales Review': 'status-sales-preview',
    'Revenue dept': 'status-revenue-dept',
    'Pricing team': 'status-pricing-team',
    'Live': 'status-live',
    'Completed': 'status-completed',
    'Closed - Not moving ahead': 'status-closed-not-moving-ahead',
    'Handover to Pricing': 'status-handover-to-pricing',
};
export default class CalendarViewBase extends NavigationMixin(LightningElement) {


    /* Configurable inputs */
    @api objectApiName;

    selectedFilters = {};   // EMPTY object
    selectedDateRange = {
        startDate: null,
        endDate: null
    };
    @api config;

 
    @track columns = [];
    @track rows = [];
    @track monthDays = [];
    @track yearMonths = [];
    currentDate = new Date();
    isMonthView = true;
    isYearView = false;
    
    @track records = [];
    showFilterPanel = false;
    @track recordAvailable = false;
    @track recordCount = 0;

    //Pagination
    @track pageSize = '10';
    @track currentPage = 1;
    @track totalPages = 0;
    @track paginatedRecords = [];
    @track disableNext = false;
    @track disablePrevious = false;
    @track showDropdown = false;

    pageSizeOptions = [
        { label: '10', value: '10' },
        { label: '50', value: '50' },
        { label: '100', value: '100' }
    ];


    @track picklistOptionsMap = {};

    @wire(getObjectInfo, { objectApiName: '$config.objectApiName' }) 
    objectInfo;

    get objectPluralLabel() {
        return this.objectInfo?.data?.labelPlural || '';
    }

    @wire(getPicklistValuesByRecordType, {
        objectApiName: '$config.objectApiName',
        recordTypeId: '$objectInfo.data.defaultRecordTypeId'
    })
    handlePicklist({ data, error }) {
        if (data) {
            const allPicklists = data.picklistFieldValues;

            this.picklistFields.forEach(field => {
                const fieldData = allPicklists[field];

                if (fieldData) {
                    this.picklistOptionsMap[field] = fieldData.values.map(v => ({
                        label: v.label,
                        value: v.value
                    }));
                }
            });

            console.log('Picklist Map:', JSON.stringify(this.picklistOptionsMap));
        } else if (error) {
            console.error('Picklist error', error);
        }
    }


    get picklistFields() {
        if (!this.config?.filters) return [];

        return this.config.filters
            .filter(f => f.type === 'picklist')
            .map(f => f.fieldApiName);
    }

    get containerClass() {
        return this.showFilterPanel
            ? 'layout layout-filter-open'
            : 'layout layout-filter-closed';
    }


    connectedCallback() {
        this.fetchCalendarRecords();
        this.buildMonthColumns(this.currentDate.getFullYear(),this.currentDate.getMonth());
    }

    
    
    get normalizedFilters() {
        if (!this.config?.filters) return [];

        return this.config.filters.map(filter => {
            const isPicklist = filter.type === 'picklist';

            return {
                ...filter,
                isPicklist,
                isText: filter.type === 'text',
                isDate: filter.type === 'date',
                options: isPicklist
                    ? (this.picklistOptionsMap[filter.fieldApiName] || [])
                    : null,
                value: this.selectedFilters[filter.fieldApiName] || null
            };
        });
    }

    get headerLabel() {
    const year = this.currentDate.getFullYear();

    if (this.isMonthView) {
        const monthName = this.currentDate.toLocaleString('default', { month: 'long' });
        return `${monthName} ${year}`;
    }

    return `${year}`;
    }
 
    get monthVariant() {
        return this.isMonthView ? 'brand' : 'neutral';
    }
 
    get yearVariant() {
        return this.isYearView ? 'brand' : 'neutral';
    }
 
    showMonthView() {
        this.isMonthView = true;
        this.isYearView = false;
        this.buildMonthColumns(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth()
            );
    }
 
    showYearView() {
        this.isMonthView = false;
        this.isYearView = true;
        //this.buildYearGrid();
        this.buildYearColumns(this.currentDate.getFullYear());
    }

    
    buildMonthColumns(year, monthIndex){
        const lastDay = new Date(year, monthIndex + 1, 0).getDate();
        this.columns = [];
        for (let d = 1; d <= lastDay; d++) {
            const dateStr = `${year}-${String(monthIndex+1).padStart(2,'0')}-${String(d).padStart(2, '0')}`;
            this.columns.push({
                key:dateStr,
                date:dateStr,
                label: d
            });
        }

         this.rows = this.paginatedRecords.map(rec => ({
            recordId: rec.recordId,
            name: rec.name,
            cells: this.columns.map(col => {
                const filled = this.isDateInRange(col.date, rec.startDate, rec.endDate);
                const isStart = col.date === rec.startDate;
                const isEnd = col.date === this.formatDate(new Date(rec.endDate));
                console.log('Dattes---'+new Date(col.date)+'compare -------'+ this.formatDate(new Date(rec.endDate)));
                console.log(rec.name+'----'+filled+'---'+col.date+'---'+rec.startDate+'---'+rec.endDate)
                var statusClass = statusClassMap[rec.status] || '';
                if (isStart) statusClass = statusClass+ ' Borderradiusleft';
                if (isEnd) statusClass = statusClass+ ' Borderradiusright';
                console.log('statusClass---'+statusClass);
                return{
                    key: col.key,
                    filled,
                    className: filled ? `progress-fill Stripped-Bar ${statusClass}` : ''
                }
            })
        }));
    }

    buildYearColumns(year) {
        const months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];
 
        
        this.columns = months.map((label, idx) => {
            const monthIndex = idx; // 0-11
            const key = `${year}-${String(monthIndex+1).padStart(2,'0')}`;
            return { key, label, monthIndex };
        });


        this.rows = this.paginatedRecords.map(rec => ({
            recordId: rec.recordId,
            name: rec.name,
            cells: this.columns.map(col => {
                
                // Compute the month’s start & end dates
                const monthStart = `${year}-${String(col.monthIndex+1).padStart(2,'0')}-01`;
                const monthEnd = new Date(year, col.monthIndex + 1, 0);  // last day of month
                const monthEndStr = `${year}-${String(col.monthIndex+1).padStart(2,'0')}-${String(monthEnd.getDate()).padStart(2,'0')}`;
                
                const isStartMonth = rec.startDate.startsWith(`${year}-${String(col.monthIndex+1).padStart(2,'0')}`);
                const isEndMonth = rec.endDate.startsWith(`${year}-${String(col.monthIndex+1).padStart(2,'0')}`);

                const filled =  this.isDateInRange(monthStart, rec.startDate, rec.endDate) ||
                                this.isDateInRange(monthEndStr, rec.startDate, rec.endDate) ||
                                this.isDateInRange(rec.startDate, monthStart, monthEndStr);
                var statusClass = statusClassMap[rec.status] || '';
                if (isStartMonth) statusClass = statusClass+ ' Borderradiusleft';
                if (isEndMonth) statusClass = statusClass+ ' Borderradiusright';
                console.log('statusClass---'+statusClass);
                console.log(rec.name+'----'+filled+'---'+col.label+'---'+rec.startDate+'---'+rec.endDate)
                return{
                    key: col.key,
                    filled,
                    className: filled ? `progress-fill Stripped-Bar ${statusClass}` : ''
                }
            })
        }));
    }

    isDateInRange(cellDate, startDate, endDate) {
        const cell = new Date(cellDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return cell >= start && cell <= end;
    }

    handlePrevious(){
        if (this.isMonthView) {
        // Go to previous month
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() - 1,
                1
            );
        }else if (this.isYearView) {
            // Go to previous year
            this.currentDate = new Date(
                this.currentDate.getFullYear() - 1,
                this.currentDate.getMonth(),
                1
            );
        }
        this.fetchCalendarRecords();
    }

    handleNext(){
        if (this.isMonthView) {
        // Go to previous month
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() + 1,
                1
            );
            
        }else if (this.isYearView) {
        // Go to previous year
        this.currentDate = new Date(
            this.currentDate.getFullYear() + 1,
            this.currentDate.getMonth(),
            1
        );
        }
        this.fetchCalendarRecords();
    }

    handleCurrent(){
        this.currentDate = new Date(); 
        this.fetchCalendarRecords();  
    }

    toggleFilterPanel(){
        this.showFilterPanel = !this.showFilterPanel;
    }

    
    fetchCalendarRecords() {
        const { startDate, endDate } = this.getQueryDateRange();
        console.log('Passed QueryDaterange');
        getCalendarRecords({
                objectApiName: this.config.objectApiName,
                fields: this.config.fields,
                startDateField: this.config.startDateField,
                endDateField: this.config.endDateField,
                filters: this.selectedFilters || {},
                startDate,
                endDate
            })
            .then(data => {
                console.log('Data---'+JSON.stringify(data, null, 2));
                if (data){
                    this.records = data.map(rec => ({
                        recordId: rec.Id,
                        name: rec.Name,
                        status: rec[this.config.statusField],
                        startDate: rec[this.config.startDateField],
                        endDate: rec[this.config.endDateField]
                    }));
                this.recordAvailable = this.records.length > 0;
                this.recordCount = this.records.length;            
                this.currentPage = 1;
                this.setPaginatedData();
                console.log('Records--from base--'+JSON.stringify(this.records, null, 2));
                } else if (error) {
                    console.error(error);
                }
            })
            .catch(console.error);

    }

    setPaginatedData() {
        this.showSpinner = false;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;

        this.paginatedRecords = this.records.slice(start, end);
        this.totalPages = Math.ceil(this.records.length / this.pageSize);
        
        console.log('check current page' + this.currentPage);
        

        this.disablePrevious = this.currentPage === 1
        this.disableNext = this.currentPage == this.totalPages;

        if (this.isMonthView) {
            this.buildMonthColumns(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth()
            );
        } else {
            this.buildYearColumns(this.currentDate.getFullYear());
        }

    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.setPaginatedData();
        }
    }

    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.setPaginatedData();
        }
    }

    handlePageSizeChange(event) {
        this.pageSize = event.detail.value; 

        // Convert to number if needed
        //this.pageSize = parseInt(this.pageSize, 10);

        this.currentPage = 1; // reset to first page
        this.setPaginatedData();
    }

    getQueryDateRange() {
    let startDate, endDate;

    if (this.isMonthView) {
        const y = this.currentDate.getFullYear();
        const m = this.currentDate.getMonth();

        startDate = new Date(y, m, 1);        // Apr 1
        endDate   = new Date(y, m + 1, 0);    // Apr 30
    } else {
        const y = this.currentDate.getFullYear();

        startDate = new Date(y, 0, 1);        // Jan 1
        endDate   = new Date(y, 11, 31);      // Dec 31
    }
    console.log('STartdate range---'+startDate);
    console.log('EndDate Range---'+endDate);
    return {
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate)
    };
    }

    formatDate(date) {
        console.log('Date before--'+date);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        console.log('Date after--'+`${y}-${m}-${d}`);
        return `${y}-${m}-${d}`;
    }


    handleFilterChange(event){

        const field = event.target.dataset.field;
        let value = event.target.value;

        if (typeof value === 'string') {
            value = value.trim();
        }
        
        if (value) {
            this.selectedFilters[field] = value.trim();
        } else {
            delete this.selectedFilters[field];
        }
        this.selectedFilters = { ...this.selectedFilters };
        console.log('Selected Filters:', JSON.stringify(this.selectedFilters));

    }

    applyFilters(){
        this.fetchCalendarRecords();
        this.toggleFilterPanel();
    }

    handleClearFilters() {
        // 1. Clear filter object
        this.selectedFilters = {};

        // 2. Clear UI inputs manually
        const inputs = this.template.querySelectorAll(
            'lightning-input, lightning-combobox'
        );

        inputs.forEach(input => {
            input.value = null;
        });

        // 3. Fetch unfiltered data (date range still applies)
        //this.fetchCalendarRecords();
        //this.toggleFilterPanel();
    }

    handleNavigate(event) {
        const recordId = event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
    }


 
}