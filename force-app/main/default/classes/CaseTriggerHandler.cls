public class CaseTriggerHandler {

    public static void sendEmail2Case(List<Case> caseList){
        
        List<Messaging.SingleEmailMessage> lstEmail = new List<Messaging.SingleEmailMessage>();
        for(Case c: caseList){
            Messaging.SingleEmailMessage semail = new Messaging.SingleEmailMessage();
            semail.setToAddresses(new String[]{c.SuppliedEmail});
            semail.setSubject('Test mail notification for Case creation');
            semail.setPlainTextBody('This is the sample mail notification for case creation');
            lstEmail.add(semail);
        }
        Messaging.sendEmail(lstEmail);
    }
    
    public static void updateCaseNumberOnAccount(List<Case> caseLIst){
        Map<Id, Account> accMap = new Map<Id, Account>();
        for(Case c:caseList){
            Account a = new Account();
            a.Id = c.AccountId;
            a.Latest_Case_Number__c = c.caseNumber;
            accMap.put(c.AccountId,a);
        }
        if(!accMap.values().isEmpty()){
            update accMap.values();
        }
    }
}