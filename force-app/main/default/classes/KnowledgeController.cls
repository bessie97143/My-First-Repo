public class KnowledgeController {
    
    
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getKnowledgeArticles(String categoryGroupName, String categoryName) {
        system.debug('Inside get Knowledge Article method');
        system.debug('categoryName : '+categoryName);
        List<KnowledgeWrapper> result = new List<KnowledgeWrapper>();
        
        if (String.isEmpty(categoryName)|| categoryName=='') {
            categoryName = 'top_category1__c'; // Set your default category name
        }
        
         String query = 'SELECT Id, Title, LastPublishedDate  ' +
                        'FROM Knowledge__kav ' +
                        'WHERE PublishStatus = \'online\' ' +
             			'WITH DATA CATEGORY ' + categoryGroupName +
             			' below ' + categoryName;
        system.debug(query);

        // Execute the dynamic query
        return Database.query(query);
        // Query to fetch the knowledge articles with data category information
       
    }


    
     public class KnowledgeWrapper {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String Title { get; set; }
        @AuraEnabled public String PublishStatus { get; set; }
        @AuraEnabled public Datetime LastPublishedDate { get; set; }
         
        
        public KnowledgeWrapper(String id, String title, String PublishStatus, Datetime LastPublishedDate) {
            this.Id = id;
            this.Title = title;
            this.PublishStatus = PublishStatus;
            this.LastPublishedDate = LastPublishedDate;
        }
     }
    
}