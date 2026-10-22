public class ApexPracticeExamples {

    public static String NameFromEmail(String email){
    	List<String> names = email.split('\\.');
    	String firstName = names[0];
    	String secondName = names[1].split('@')[0];
    	return firstName.toLowercase().capitalize()+' '+secondName.toLowercase().capitalize();
    }
    
    public static Integer nextPrime(Integer n){
        Integer num = n+1;
        if(num>3){
            Boolean prime = false;
            while(!prime){
                system.debug('Inside while loop num = '+num);
                if(Math.mod(num,2)==0){
                    system.debug('number is even');
                    num++;
                    system.debug('Going for next while loop1');
                    continue;
                }
                for(Integer i=3;i<(num-1)/2;i++){
                    if(Math.mod(num,i)==0){
                        prime = false;
                        system.debug('Number is divisible by '+i);
                        num++;
                        break;
                    }prime = true;
                }system.debug('Out of FOR');
                if(!prime){
                    system.debug('Going for next while loop2');
                    continue;
                }
                prime = true;
            }
        }return num;
    }
    
    public static String reverse(String word){
        String reversedString = '';
        for(Integer i=word.length()-1;i>=0;i--){
            reversedString += word.substring(i,i+1);
        }
		return reversedString;
    }
    
    public static String reverseWordsInASentence(String sentence){
    	if(sentence == null) return null;
    	String reversedSentence = '';
    	String senRev = reverse(sentence);
    	String[] words = senRev.split(' ');
    	for(String word : words){
        	reversedSentence += reverse(word)+' ';
    	}
		return reversedSentence.substring(0,reversedSentence.length()-1);
	}
    
    
}