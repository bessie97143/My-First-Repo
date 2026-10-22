public class DescribeDataCategoryGroupSample {
   public static List<DescribeDataCategoryGroupResult> describeDataCategoryGroupSample(){
      List<DescribeDataCategoryGroupResult> describeCategoryResult;
      try {
         //Creating the list of sobjects to use for the describe
         //call
         List<String> objType = new List<String>();

         objType.add('KnowledgeArticleVersion');
         //objType.add('Question');

         //Describe Call
         describeCategoryResult = Schema.describeDataCategoryGroups(objType);
   
         //Using the results and retrieving the information
         for(DescribeDataCategoryGroupResult singleResult : describeCategoryResult){
            //Getting the name of the category
            String CategoryName = singleResult.getName();

            //Getting the name of label
            String LabelName = singleResult.getLabel();

            //Getting description
            String Description = singleResult.getDescription();

            //Getting the sobject
            String objectName = singleResult.getSobject();
             
            system.debug('CategoryName : '+CategoryName);
            system.debug('LabelName : '+LabelName);
            system.debug('Description : '+Description);
            system.debug('objectName : '+objectName);
         }         
      } catch(Exception e){
      }
      
      return describeCategoryResult;
   }
}