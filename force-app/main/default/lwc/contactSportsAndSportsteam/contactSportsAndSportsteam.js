import { LightningElement,wire, api,track } from 'lwc';
import getSportsToTeamsMap from '@salesforce/apex/ContactSportsController.getSportsToTeamMap';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Contact.sport']

export default class ContactSportsAndSportsteam extends LightningElement {

    @api recordId;
    isEditMode = false;

    

    sportsToTeamsMap = [];
    sportsOptions = [];
    sportsList = []
    sportsTeamOptions = [];

    selectedSports = [];
    selectedTeams = [];


    
    @wire(getSportsToTeamsMap)
    wiredMap({error, data}){
        if(data){
            this.sportsToTeamsMap = data;
            this.sportsOptions = Object.keys(data).map(sport => ({label: sport, value: sport}));
            console.log('this.sportsOptions'+this.sportsOptions);
        }
    }

    @track sportsTeamOptions = [];



    handleSportsChange(event){
        const indent = '\u2003\u2003';
        this.selectedSports = event.detail.value;
        console.log('this.selectedSports'+this.selectedSports);
        this.sportsTeamOptions = [];
        this.selectedSports.forEach(sport=>{
            this.sportsTeamOptions.push({
                label : sport.toUpperCase(),
                value : sport,
                disabled: true
            })
            this.sportsList.push(sport);
            const items = [];
            (this.sportsToTeamsMap[sport]|| []).forEach(team=>{
                items.push({
                    label : `${indent}${sport}-${team}`,
                    value : team
                })
            })
            this.sportsTeamOptions.push(...items);

        console.log('this.sportsTeamOptions'+this.sportsTeamOptions);

        });
      

    }

    handleTeamChange(event){
        this.selectedTeams = event.detail.value;
        this.selectedTeams = this.selectedTeams.filter((item) => !this.sportsList.includes(item));
    }

}