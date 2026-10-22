global class InboundEmailHandler implements Messaging.InboundEmailHandler {
    
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope){
        system.debug('Email Receievd----'+email);
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        String subject = email.subject;
        String body = email.plainTextBody;
        String fromAddress = email.fromAddress;
        system.debug(subject);
        system.debug('Before extract method');
        Id caseId = extractCase(subject);
        if(caseId !=null){
            system.debug('Case Number Extracted----'+caseId);
        }
        result.success = true;
        return result;
    }
    
    private Id extractCase(String subject){
        system.debug('Inside extract method');
        Pattern pattern = Pattern.compile('[^0-9]*([0-9]{8})[^0-9]*');
        Matcher matcher = Pattern.matcher(subject);
        system.debug('Matcher----'+matcher);
        system.debug('Matcher grp----'+matcher.group(0));
        if(matcher.find()){
            return matcher.group(0);
        }return null;
    }

}