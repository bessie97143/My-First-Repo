import { LightningElement,wire, api,track } from 'lwc';
import getSportsTeamsMap from '@salesforce/apex/ContactSportsController.getSportsToTeamMap';
import getSportsToTeamsMap from '@salesforce/apex/ContactSportsController.getApprovalRecords';
import saveContact from '@salesforce/apex/ContactSportsController.saveContactFields';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { getRecord } from 'lightning/uiRecordApi';

import SPORTS_FIELD from '@salesforce/schema/Contact.Sports__c';
import SPORTS_TEAMS_FIELD from '@salesforce/schema/Contact.Sports_Team__c';

export default class ContactSportsAndSportsteam1 extends LightningElement {

    @api recordId;
    contact;
    isEditMode = false;
    hasRendered = false;

    sportsToTeamsMap = [];

    sportsOptions = [];
    selectedSportTeamMap = [];

    selectedSports = [];
    selectedTeams = [];
    selectedTeamsMap = new Map();
    
    @wire(getRecord, { recordId: '$recordId', fields: [SPORTS_FIELD,SPORTS_TEAMS_FIELD] })
    wiredcontact({error,data}){
        if(data){
            this.contact = data;
            this.selectedSports = (this.contact.fields.Sports__c.value || '').split(';').filter(Boolean);
            this.selectedTeams = (this.contact.fields.Sports_Team__c.value || '').split(';').filter(Boolean);
        }
        else if(error){
            console.log('Error loading contact---'+error);
        }
    }
    
    @wire(getSportsToTeamsMap)
    wiredMap({error, data}){
        if(data){
            this.sportsToTeamsMap = data;
            this.sportsOptions = Object.keys(data).map(sport => ({label: sport, value: sport}));
            console.log('this.sportsToTeamsMap'+this.sportsToTeamsMap);
            console.log('this.sportsOptions'+this.sportsOptions);
            this.updateSportsTeamsOption();
        }
    }

    handleSportsChange(event){
        this.selectedSports = event.detail.value;
        this.selectedSportTeamMap = [];
        this.updateSportsTeamsOption();
        this.selectedTeams = [...new Set(Array.from(this.selectedTeamsMap.values()).flat())];
    }

    handleTeamChange(event){
        let sport  = event.target.name;
        let sportTeam = event.detail.value;
        this.selectedTeamsMap.set(sport,sportTeam);
        this.selectedTeams = [...new Set(Array.from(this.selectedTeamsMap.values()).flat())];

        const mapAsArray = Array.from(this.selectedTeamsMap);
        console.log(JSON.stringify(mapAsArray, null, 2));      
        
    }

    updateSportsTeamsOption(){
        this.selectedSports.forEach(item => {
            const items = [];
            (this.sportsToTeamsMap[item] || []).forEach(element => {
                items.push({
                    label : element,
                    value : element
                })
            });
            this.selectedSportTeamMap.push({
                sport: item,
                Teams: items
            })
            console.log('selectedSportTeamMap--------'+JSON.stringify(this.selectedSportTeamMap, null, 4));
        });

        for(let key of this.selectedTeamsMap.keys()){
            if(!this.selectedSports.includes(key)){
                console.log('key to delete'+key);
                this.selectedTeamsMap.delete(key);
            }
        }
        
        const mapAsArray1 = Array.from(this.selectedTeamsMap);
        console.log(JSON.stringify(mapAsArray1, null, 2));
        
    }


    renderedCallback(){
        if(this.selectedTeamsMap.size !=0) return;
        this.template.querySelectorAll('lightning-dual-listbox').forEach(box=>{
            if(this.selectedSports.includes(box.name)){
                const boxValue = box.value.filter(item => this.sportsToTeamsMap[box.name]?.includes(item));
                this.selectedTeamsMap.set(box.name,boxValue);
            }
        });

        const mapAsArray1 = Array.from(this.selectedTeamsMap);  
        console.log('selectedTeamsMap from rendered callback--'+JSON.stringify(mapAsArray1, null, 2));
    }

    handleSave(){
        saveContact({contactId : this.recordId, 
            Sports : this.selectedSports.join(';'),
            teams : this.selectedTeams.join(';')
        })
        .then((result)=>{
            console.log('Contact Updated Successfully');
            getRecordNotifyChange([{recordId: this.recordId}]);
        })
        .catch(error=>{
            console.log('Error while updating Contact-----'+error);
        })
    }


}