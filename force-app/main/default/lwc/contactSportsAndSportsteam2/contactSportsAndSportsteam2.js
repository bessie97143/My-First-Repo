import { LightningElement,wire, api,track } from 'lwc';
import getSportsToTeamsMap from '@salesforce/apex/ContactSportsController.getSportsToTeamMap';
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
            console.log('selecetd sports includes Cricket-------'+this.selectedSports.includes("Cricket"));
            console.log('selecetd sports-------'+this.selectedSports);
            console.log('selected teams---------'+this.selectedTeams);
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
            //this.selectedSports = ['Cricket','Soccer/Football'];
            this.updateSportsTeamsOption();
        }
    }

    handleSportsChange(event){
        this.selectedSports = event.detail.value;
        this.selectedSportTeamMap = [];
        console.log('this.selectedSports'+this.selectedSports);
        
        this.selectedSports.forEach(item => {
            console.log('Current Item from selectedSports--------------'+item)
            const items = [];
            (this.sportsToTeamsMap[item] || []).forEach(element => {
                items.push({
                    label : element,
                    value : element
                })
            });
            console.log('Teams-----'+items);
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
        this.selectedTeams = [...new Set(Array.from(this.selectedTeamsMap.values()).flat())];
        console.log('selectedTeamsMap from handleSportsChange--'+JSON.stringify(mapAsArray1, null, 2));
        

    }

    handleTeamChange(event){
        //this.selectedTeams = event.detail.value;
        let sport  = event.target.name;
        let sportTeam = event.detail.value;
        this.selectedTeamsMap.set(sport,sportTeam);
        this.selectedTeams = [...new Set(Array.from(this.selectedTeamsMap.values()).flat())];

        const mapAsArray = Array.from(this.selectedTeamsMap);
        

        console.log('Team selected from Sport---'+sport);
        console.log('selectedTeams for '+sport+'-----'+sportTeam);
        console.log('selectedTeamsMap--------'+this.selectedTeamsMap.get(sport));
        console.log(JSON.stringify(mapAsArray, null, 2));
        console.log('selectedTeamsMap--------'+this.selectedTeamsMap);       
        
    }

    updateSportsTeamsOption(){
        this.selectedSports.forEach(item => {
            console.log('Current Item from selectedSports--------------'+item)
            const items = [];
            (this.sportsToTeamsMap[item] || []).forEach(element => {
                items.push({
                    label : element,
                    value : element
                })
            });
            console.log('Teams-----'+items);
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

        console.log('Inside renderedCallback');
        this.template.querySelectorAll('lightning-dual-listbox').forEach(box=>{
            console.log('box.name'+box.name);
            console.log('this.selectedSports'+this.selectedSports);
            if(this.selectedSports.includes(box.name)){
                const boxValue = box.value.filter(item => this.sportsToTeamsMap[box.name]?.includes(item));
                console.log('filtered box.value----'+boxValue);
                this.selectedTeamsMap.set(box.name,boxValue);
            }
        });

        const mapAsArray1 = Array.from(this.selectedTeamsMap);  
        console.log('selectedTeamsMap from rendered callback--'+JSON.stringify(mapAsArray1, null, 2));
    }

    handleSave(){
        console.log('Inside save');
        const Sporti = this.selectedSports.join(';');
        const teami = this.selectedTeams.join(';');
        console.log('Sporti----'+Sporti);
        console.log('teami----'+teami);
        saveContact({contactId : this.recordId, 
            Sports : Sporti,
            teams : teami
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