@isTest
private class KnowledgeControllerTest {

    @isTest
    static void testGetKnowledgeArticles() {
        Test.startTest();
        List<Knowledge__kav> result = KnowledgeController.getKnowledgeArticles('Category_Group1__c', 'top_category1__c');
        Test.stopTest();
    }

}