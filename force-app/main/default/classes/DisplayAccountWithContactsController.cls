public class DisplayAccountWithContactsController {
    
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccounts(){
		List<Account> accList =  [SELECT Id,Name, Type, BillingCountry,(select id from Opportunities) from Account];
        List<AccountWrapper> accDataToDisplay = new List<AccountWrapper>();
        for(Account a : accList){
            AccountWrapper wrap = new AccountWrapper();
            wrap.Id = a.Id;
            wrap.Name = a.Name;
            wrap.Type = a.Type;
            wrap.BillingCountry = a.BillingCountry;
            wrap.OpportunityCount = a.Opportunities.size();
            accDataToDisplay.add(wrap);
        }
        system.debug('accDataToDisplay---'+accDataToDisplay);
        return accDataToDisplay;
    }
    
    public class AccountWrapper{
        @AuraEnabled public String Id{get; set;}
        @AuraEnabled public String Name{get; set;}
        @AuraEnabled public String Type{get; set;}
        @AuraEnabled public String BillingCountry{get; set;}
        @AuraEnabled public Integer OpportunityCount{get; set;}
        	
    }
    
    @AuraEnabled
    public static void deleteAccount(String acctId){
        Account acc = [Select id, (Select id from Opportunities) from Account where id =: acctId];
        if(acc.Opportunities.size()>0){
            throw new AuraHandledException('Account Cannot be deleted due to open opportunities');
        }else{
            try{
                delete acc;
            }catch(exception e){
                throw new AuraHandledException(e.getMessage());
            }
        }
    }

}