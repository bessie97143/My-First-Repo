public class ApexDSA {

    public static void reverseString(String str1){
        List<String> strSplit = str1.split('');
        Integer ptr1 = 0;
        Integer ptr2 = strSplit.size()-1;
        while(ptr1<ptr2){
            String temp = strSplit[ptr2];
            strSplit[ptr2] = strSplit[ptr1];
            strSplit[ptr1] = temp;
            ptr1++;
            ptr2--;
            
        }
    }
    
    public static void validAnagram(String str1, String str2){
        List<String> lst1 = str1.split('');
        List<String> lst2 = str2.split('');
        lst1.sort();
        lst2.sort();
        Boolean isAnagram = lst1.equals(lst2);
        system.debug('isAnagram---'+isAnagram);
        system.debug('isEqual==---'+(lst1==lst2));
        
    }
    
    
    public static void containsDuplicate(String str){
        Set<String> unique = new Set<String>();
        List<String> lstStr = str.split('');
        
        for(String s : lstStr){
            if(unique.contains(s)){
                System.debug('Duplicate detected');
            }else{
                unique.add(s);
            }
        }
    }
}