public class AccountsWithRelatedContactsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
		return [Select Id, Name, Type, BillingCountry from Account];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id AccountId){
        return [Select Id, FirstName, LastName, Email from Contact where AccountId =:AccountId];
    }

}