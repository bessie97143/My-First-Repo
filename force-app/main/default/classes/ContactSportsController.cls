public class ContactSportsController {

    @AuraEnabled(cacheable=true)
    public static Map<String, List<String>> getSportsToTeamMap(){
        Map<String, List<String>> sportsMap = new Map<String, List<String>>();
        sportsMap.put('Cricket', new List<String>{'India','Australia','England','SouthAfrica'});
        sportsMap.put('Soccer/Football',new List<String>{'Barcelona','Liverpool','Real Madrid'});
        sportsMap.put('Basketball',new List<String>{'Lakers','Warriors','Bull'});
        return sportsMap;
    }
    
    @AuraEnabled
    public static void saveContactFields(Id contactId, String Sports, String teams){
        system.debug('Sports seleted---'+Sports);
        system.debug('Teams seleted---'+teams);
        Contact c = new Contact();
        c.Id = contactId;
        c.Sports__c = sports;
        c.Sports_Team__c = teams;
        Database.update(c, true);
	}
    
    @AuraEnabled(cacheable=true)
    public static  Map<String, List<String>> getApprovalRecords(){
        Map<String, List<String>> sportsTeamsMap = new Map<String, List<String>>();
        for(Approval_Matrix__c am : [Select Id, Sports__c, SportsTeamsTA__c, SportsTeamT__c from Approval_Matrix__c where Sports__c !='']){
            String sport = am.Sports__c.trim();
            List<String> teams = am.SportsTeamsTA__c.split('[\\r\\n]+');
            system.debug(sport+'----'+teams);
            sportsTeamsMap.put(sport,teams);
        }
        return sportsTeamsMap;
    } 
}