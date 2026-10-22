public class BinaryTree {
    
    //*Node Class
    public class Node{
        Object data;
        Node left;
        Node right;
        
        public Node(Object data){
            this.data = data;
            this.left = NULL;
            this.right = NULL;
		}
    }
    
    //*Root of a binary tree
    Node root;
    
    //*method to insert data into binary tree
    private void insertData(object data){
        
        //*if root is NULL, create a root Node
        if(root==NULL){
            root = new Node(data);
            return;
        }
        
        //*initializing a queue of node
        List<Node> nodesQueue = new List<Node>();
        
        //*Adding the root node to the queue 
        nodesQueue.add(root);
        
        //*looping while queue is not empty
        while(!nodesQueue.isEmpty()){
			
            //*getting the current Node and removing it from queue
            Node current = nodesQueue.get(0);
            nodesQueue.remove(0);
            
            //*if the left of current is null, create a new node and attach it as the left child
            if(current.left==NULL){
                current.left = new Node(data);
                return;
			}
            //*otherwise add it to the nodesQueue
            nodesQueue.add(current.left);
            
            //*if the right of current is null, create a new node and attach it as the right child
            if(current.right==NULL){
                current.right = new Node(data);
                return;
			}
            //*otherwise add it to the nodesQueue
            nodesQueue.add(current.right);
		}
        
	}
    
    /*
    *  Description:- This method is used to insert data inside a binary tree based on the parent node's data
    */
    public Node insertData(Object data, Object parentData, Comparator comparator){
        
        // * If root node is NULL, create a new node, assign it as the root node and return that
        if(root == NULL){
            root = new Node(data);
            return root;
		}
        
        // * Otherwise, call the recursive function using the root node
        return insertDataRecursive(root, data, parentData, comparator);
    }
    
    /*
    *  Description:- This helper method is used to insert data inside a binary tree based on the parent node's data
    */
    private Node insertDataRecursive(Node current, Object data, Object parentData, Comparator comparator){
        
        // * If current node's data is equal to parentData
        if(comparator.compare(current.data, parentData)){
            
            if(current.left == NULL){
                current.left = new Node(data);
                return current.left;
            }
            else if(current.right == NULL){
                current.right = new Node(data);
                return current.right;
			}
            else{
                return NULL;
            }
        }
        
        // * If left child of current node is NULL, add a new node as the left child of the current node and return that
        if(current.left != NULL){
            Node left = insertDataRecursive(current.left, data, parentData, comparator);
            if(left != NULL){
            	return left;
        	}
        }
        
        // * If right child of current node is NULL, add a new node as the right child of the current node and return that
        if(current.right != NULL){
            Node right = insertDataRecursive(current.right, data, parentData, comparator);
            if(right != NULL){
            	return right;
        	}
        }
        
        // * Otherwise, return NULL as the current node already has two nodes and a new node cannot be inserted
        return NULL;
    }
    
    /*
    *  Description:- This method is used to create a binary tree
    */
    public void createBinaryTree(List<object> elements){
        
        //*inserting elements in the binary tree
        for(Object element : elements){
            insertData(element);
        }
        
    } 
    
    //* This method is to print the binary tree level by level
    public void levelOrderPrint(){
        
        //*Checking if root is not null
        if(root!=NULL){
			
            String result = '\n';
            
            //*initializing a queue of node
        	List<Node> nodesQueue = new List<Node>();
            
            //*Adding root node to the queue
            nodesQueue.add(root);
            
            //* Looping while queue is not empty
            while(!nodesQueue.isEmpty()){
                
                //*Getting nodes at the current level
                Integer nodesAtCurrentLevel = nodesQueue.size();
                
                //*Looping while nodes at the current level is more than 0
                while(nodesAtCurrentLevel>0){
                    
                    //*Getting the current Node and removing it from the queue
                    Node current = nodesQueue.get(0);
                    nodesQueue.remove(0);
                    
                    //*Adding the current node data to the result
                    result += current.data +' ';
                    
                    //* If left node is not null, add it to the queue
                    if(current.left != NULL){
                        nodesQueue.add(current.left);
					}
                    
                    //* If right node is not null, add it to the queue
                    if(current.right != NULL){
                        nodesQueue.add(current.right);
                    }
                    
                    //*Decrementing the nodes at the current level by 1
                    nodesAtCurrentLevel--;
                }
                
                //* Adding a new line to the result for the next level
                result += '\n';
                
            }
            
            //*Displaying the result
            System.debug(result);
		}
        
        else{
        	System.debug('Tree not found');
        }
    }

}