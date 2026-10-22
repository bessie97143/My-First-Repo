public class ApexPracticeDB {

     public static Id insertStudent(String name, String email) {
    	apxio__Student__c apxio = new apxio__Student__c();
   	 	apxio.Name = name;
    	apxio.apxio__Email__c = email;
    	insert apxio;
    	return apxio.id;
	}
    
    public static Id insertCourse(String name, String details, Integer credits) {
    	apxio__Course__c apc = new apxio__Course__c();
        apc.Name = name;
        apc.apxio__Course_Details__c = details;
        if(credits>4) return null;
        apc.apxio__Credits__c = String.valueof(credits);
        insert apc;
        return apc.id;
	}
}