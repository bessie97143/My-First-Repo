public class DataCategoryTreeStructure {
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getCategoryGroups() {
        List<String> categoryGroups = new List<String>();
        List<DescribeDataCategoryGroupResult> describeCategoryResult;

        try {
            List<String> objType = new List<String>();
            objType.add('KnowledgeArticleVersion');

            // Describe Call
            describeCategoryResult = Schema.describeDataCategoryGroups(objType);

            for (DescribeDataCategoryGroupResult singleResult : describeCategoryResult) {
                categoryGroups.add(singleResult.getName());
            }

        } catch (Exception e) {
            System.debug(e.getMessage());
        }

        return categoryGroups;
    }

    
    @AuraEnabled(cacheable=true)
    public static List<TreeNode> getCategoryTree(String groupName) {
        List<TreeNode> tree = new List<TreeNode>();
        List<DescribeDataCategoryGroupStructureResult> dataCategoryGroupStructure;
        List<DataCategoryGroupSobjectTypePair> pairs;

        try {
            List<String> objType = new List<String>();
            objType.add('KnowledgeArticleVersion');

            DataCategoryGroupSobjectTypePair pair1 = new DataCategoryGroupSobjectTypePair();
            pair1.setSobject('KnowledgeArticleVersion');
            pair1.setDataCategoryGroupName(groupName);
            pairs = new List<DataCategoryGroupSobjectTypePair>{ pair1 };

            dataCategoryGroupStructure = Schema.describeDataCategoryGroupStructures(pairs, false);

            for (DescribeDataCategoryGroupStructureResult singleResult1 : dataCategoryGroupStructure) {
                List<DataCategory> firstLevelCategory = singleResult1.getTopCategories();
                for (DataCategory singleResultSubTopCatLevel1 : firstLevelCategory) {
                    TreeNode node = new TreeNode(singleResultSubTopCatLevel1.getLabel(), singleResultSubTopCatLevel1.getName(), true, 
                        getChildCategories(singleResultSubTopCatLevel1));
                    tree.add(node);
                }
            }

        } catch (Exception e) {
            System.debug(e.getMessage());
        }

        return tree;
    }

    private static List<TreeNode> getChildCategories(DataCategory parentCategory) {
        List<TreeNode> nodes = new List<TreeNode>();
        List<DataCategory> childCategories = parentCategory.getChildCategories();
        for (DataCategory category : childCategories) {
            TreeNode node = new TreeNode(category.getLabel(), category.getName(), true, getChildCategories(category));
            nodes.add(node);
        }
        return nodes;
    }

    public class TreeNode {
        @AuraEnabled public String label { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public Boolean disabled { get; set; }
        @AuraEnabled public Boolean expanded { get; set; }
        @AuraEnabled public List<TreeNode> items { get; set; }

        public TreeNode(String label, String name, Boolean expanded, List<TreeNode> items) {
            this.label = label;
            this.name = name;
            this.disabled = false;
            this.expanded = false;
            this.items = items;
        }
    }
    
    // New Method for Search Functionality
    @AuraEnabled(cacheable=true)
    public static List<TreeNode> searchCategoryTree(String groupName, String searchTerm) {
        List<TreeNode> fullTree = getCategoryTree(groupName); // Load the full tree first
        List<TreeNode> filteredTree = new List<TreeNode>();

        // Recursively filter the tree based on the search term
        for (TreeNode node : fullTree) {
            TreeNode filteredNode = filterTreeNodes(node, searchTerm);
            if (filteredNode != null) {
                filteredTree.add(filteredNode);
            }
        }

        return filteredTree;
    }

    // Helper method to recursively filter nodes
    private static TreeNode filterTreeNodes(TreeNode node, String searchTerm) {
        if (node.label.toLowerCase().contains(searchTerm.toLowerCase())) {
            return node; // If the current node matches the search term, return the node
        }

        List<TreeNode> filteredChildren = new List<TreeNode>();
        for (TreeNode child : node.items) {
            TreeNode filteredChild = filterTreeNodes(child, searchTerm);
            if (filteredChild != null) {
                filteredChildren.add(filteredChild); // Add child nodes that match the search term
            }
        }

        if (!filteredChildren.isEmpty()) {
            return new TreeNode(node.label, node.name, true, filteredChildren); // Return node with matching children
        }

        return null; // No match found
    }
}