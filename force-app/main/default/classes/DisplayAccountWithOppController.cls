public class DisplayAccountWithOppController {
    
    @AuraEnabled(Cacheable= true)
    public static list<AccountWithOpp> getAccountWithOpportunity(){
        List<AccountWithOpp> AcctWithOpp = new List<AccountWithOpp>();
        List<Account> accList = [Select id, Name, Type, BillingCountry, (Select id from Opportunities) from Account];
        for(Account a : accList){
            AccountWithOpp ao = new AccountWithOpp();
            ao.AcctId = a.Id;
            ao.AcctUrl = '/'+a.Id;
            ao.AcctName = a.Name;
            ao.AcctType = a.Type;
            ao.AcctBillingCountry = a.BillingCountry;
            ao.TotalOpp = a.opportunities.size();
            AcctWithOpp.add(ao);
        }
        return AcctWithOpp; 
	}
    
    public class AccountWithOpp{
        @AuraEnabled public String AcctId{get; set;}
        @AuraEnabled public String AcctName{get; set;}
        @AuraEnabled public String AcctUrl{get; set;}
        @AuraEnabled public String AcctType{get; set;}
        @AuraEnabled public String AcctBillingCountry{get; set;}
        @AuraEnabled public Integer TotalOpp{get; set;}
        
    }

}