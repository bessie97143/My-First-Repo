public class EmailService {
    
    @invocableMethod
    public static void sendEmail(List<EmailRequest> requests){
        
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        for(EmailRequest req:requests){
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            
            email.setToAddresses(new String[]{req.recipientEmail});
            email.setReplyTo(req.replyTo);
            email.setSubject(req.subject);
            email.setPlainTextBody(req.body);
            email.setWhatId(req.whatId);
            if(req.targetObjectId!=null){
                email.setTargetObjectId(req.targetObjectId);
            }
            emails.add(email);
		}
        Messaging.sendEmail(emails);
	
    }

    public class EmailRequest{
        
        @InvocableVariable
        public String recipientEmail;
        
        @InvocableVariable
        public String replyTo;
        
        @InvocableVariable
        public String subject;
        
        @InvocableVariable
        public String body;
        
        @InvocableVariable
        public String targetObjectId;
        
        @InvocableVariable
        public String whatId;
    }
}