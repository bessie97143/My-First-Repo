public class DescribeDataCategoryGroupStructures {
   public static List<DescribeDataCategoryGroupStructureResult> 
   getDescribeDataCategoryGroupStructureResults(){
      List<DescribeDataCategoryGroupResult> describeCategoryResult;
      List<DescribeDataCategoryGroupStructureResult> describeCategoryStructureResult;
      try {
         //Making the call to the describeDataCategoryGroups to
         //get the list of category groups associated
         List<String> objType = new List<String>();
         objType.add('KnowledgeArticleVersion');
         //objType.add('Question');
         describeCategoryResult = Schema.describeDataCategoryGroups(objType);
         
         //Creating a list of pair objects to use as a parameter
         //for the describe call
         List<DataCategoryGroupSobjectTypePair> pairs = 
            new List<DataCategoryGroupSobjectTypePair>();
         
         //Looping throught the first describe result to create
         //the list of pairs for the second describe call
         for(DescribeDataCategoryGroupResult singleResult : 
         describeCategoryResult){
            DataCategoryGroupSobjectTypePair p =
               new DataCategoryGroupSobjectTypePair();
            p.setSobject(singleResult.getSobject());
            p.setDataCategoryGroupName(singleResult.getName());
            pairs.add(p);
         }
         
         //describeDataCategoryGroupStructures()
         describeCategoryStructureResult = 
            Schema.describeDataCategoryGroupStructures(pairs, false);

         //Getting data from the result
         for(DescribeDataCategoryGroupStructureResult singleResult : describeCategoryStructureResult){
            //Get name of the associated Sobject
            String objectName =  singleResult.getSobject();

            //Get the name of the data category group
            String CategoryName = singleResult.getName();

            //Get the name of the data category group
            String LabelName = singleResult.getLabel();

            //Get the description of the data category group
            String Description = singleResult.getDescription();
             
            system.debug('objectName : '+objectName);
            system.debug('CategoryName : '+CategoryName);
            system.debug('LabelName : '+LabelName);
            system.debug('Description : '+Description);

            //Get the top level categories
            DataCategory [] toplevelCategories = 
               singleResult.getTopCategories();
            
            //Recursively get all the categories
            List<DataCategory> allCategories = 
               getAllCategories(toplevelCategories);
             
            List<String> categoryNames = new List<String>();
         	for(DataCategory category : allCategories) {
               categoryNames.add(category.getName());
         	} 

/*
            for(DataCategory category : allCategories) {
               //Get the name of the category
               category.getName();

               //Get the label of the category
               category.getLabel();

               //Get the list of sub categories in the category
               DataCategory [] childCategories = 
                  category.getChildCategories();
            }
*/
         }
      } catch (Exception e){
      }
      return describeCategoryStructureResult;
    }
    
   private static DataCategory[] getAllCategories(DataCategory [] categories){
      if(categories.isEmpty()){
          System.debug('$$$$$$$$$$$$$Categories is  empty');         
         return new DataCategory[]{};
      } else {
         //For debugging
         System.debug('>>>>>>>>>>>>Categories is not empty');
         List<String> categoryNames = new List<String>();
         for(DataCategory category : categories) {
               categoryNames.add(category.getName());
         } 
         system.debug('Category Clone names : '+categoryNames);
         DataCategory [] categoriesClone = categories.clone();
         DataCategory category = categoriesClone[0];
         system.debug('Category ubder consideration : '+category.getName());
         DataCategory[] allCategories = new DataCategory[]{category};
         categoriesClone.remove(0);
         categoriesClone.addAll(category.getChildCategories());
         allCategories.addAll(getAllCategories(categoriesClone));
         List<String> AllcategoryNames = new List<String>();
         for(DataCategory category1 : allCategories) {
               categoryNames.add(category1.getName());
         } 
         system.debug('All Category Names : '+categoryNames);
         return allCategories;
      }
   }
}