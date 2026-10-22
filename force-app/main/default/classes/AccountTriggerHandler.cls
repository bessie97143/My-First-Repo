public class AccountTriggerHandler {

    public static void beforeInsert(List<Account> accList){
        updateRating(accList);
    }
    
    public static void beforeUpdate(List<Account> acctNew, Map<Id, Account> oldAccountMap){
        preventDuplicateAccountNames(acctNew, oldAccountMap);
    }
    
    public static void afterInsert(List<Account> newAccList,Map<Id,Account> newAccountMap){
        createContact(newAccountMap);
    }
    
    public static void afterUpdate(Map<Id,Account> oldAccountMap,List<Account> newAccList){
        updateContactPhoneNumbers(oldAccountMap,newAccList);
    }
    
    private static void updateRating(List<Account> accLists){
        for(Account a:accLists){
            if(a.Industry!=null && a.Industry=='Media'){
                a.Rating = 'Hot';
            }
        }
    } 
    
    private static void createContact(Map<Id,Account> accMap){
        List<Contact> contactsToInsert = new List<Contact>();
        system.debug('accMap'+accMap);
        for(Account a:accMap.Values()){
            Contact c = new Contact();
            c.LastName = a.Name;
            c.AccountId = a.Id;
            contactsToInsert.add(c);  
		}
        system.debug('contactsToInsert----'+contactsToInsert);
        if(!contactsToInsert.isEmpty()){
            insert contactsToInsert;
        }
        
    }
    
    private static void updateContactPhoneNumbers(Map<Id,Account> accOldMap,List<Account> newAccList){
        List<Contact> conListToUpdate = new List<Contact>();
        Map<Id,Account> accMap = new Map<Id,Account>();
        for(Account a : newAccList){
            if(a.Phone!=null && a.Phone!=accOldMap.get(a.Id).Phone){
               accMap.put(a.Id,a);
            }
        }
        if(!accMap.isEmpty()){
        	for(Contact c : [Select id, HomePhone,AccountId from Contact where AccountId in :accMap.KeySet()]){
            	c.HomePhone = accMap.get(c.AccountID).Phone;
                conListToUpdate.add(c);
        	}
        }
        
        if(!conListToUpdate.isEmpty()){
            update conListToUpdate;
        }
	}
    
    private static void preventDuplicateAccountNames(List<Account> acctNew, Map<Id, Account> oldAccountMap){
        Map<String, Account> acctMapToCheck= new Map<String, Account>();
        Set<String> acctNamesInTransaction = new Set<String>();
        
        for(Account acc : acctNew){
            Account oldAccount = oldAccountMap.get(acc.Id);
            
            if(string.isBlank(acc.Name)) continue;
            
            String acctName = acc.Name.trim().toLowerCase();
            
            if(acctNamesInTransaction.contains(acctName)){
                acc.addError('This account name is already present in current transaction');
                continue;
            }
            acctNamesInTransaction.add(acctName);
            //insert
            if(oldAccount == NULL){
                acctMapToCheck.put(acctName,acc);
			}
            //update
            else{
                if(acctName != oldAccount.Name.trim().toLowerCase()){
                    acctMapToCheck.put(acctName,acc);
                }
            }
           
        }
        
        if(acctMapToCheck.isEmpty()){
            return;
        }
        
        for(Account existingAccount : [Select id, Name from Account where Name in :acctNamesInTransaction]){
            String existingName = existingAccount.name.trim().toLowerCase();
            
            if(acctMapToCheck.containsKey(existingName)){
                Account acc = acctMapToCheck.get(existingName);
                if(acc.Id != existingAccount.Id){
                    acc.addError('Account Name already exists.');
                }
            }
        }
    }
    
    private static void updateContactDepartment(List<Account> newAccounts, Map<Id, Account> oldAccounts){
        Map<Id, String> accountsToConsider = new Map<Id, String>();
        List<Contact> contactsToUpdate = new List<Contact>();
        for(Account currAccount : newAccounts){
            Account oldAccount = oldAccounts.get(currAccount.Id);
            if(currAccount.Industry != null && oldAccount!= null && currAccount.Industry != oldAccount.Industry){
                accountsToConsider.put(currAccount.Id, currAccount.Industry);
            }
        }
        
        if(accountsToConsider.isEmpty()){
            return;
        }
        
        for(Contact cont : [Select id, AccountId, Department from Contact where AccountId in : accountsToConsider.KeySet()]){
            if(cont.Department != accountsToConsider.get(cont.AccountId)){
                cont.Department = accountsToConsider.get(cont.AccountId);
            	contactsToUpdate.add(cont);
            }
        }
        
        if(!contactsToUpdate.isEmpty()){
            update contactsToUpdate;
        }
        
    }
        
}