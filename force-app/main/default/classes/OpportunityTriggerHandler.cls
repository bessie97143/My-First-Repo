public class OpportunityTriggerHandler {

    
    public static void beforeInsert(List<Opportunity> oppList){
        preventExcessOpenOpportunities(oppList);
    }
    
    private static void preventExcessOpenOpportunities(List<Opportunity> oppList){
        Set<Id> accountIds = new Set<Id>();
        Map<Id, Integer> accountWithOppCount = new Map<Id, Integer>();
        
        for(Opportunity op : oppList){
            if(op.AccountId!=null) accountIds.add(op.AccountId);
        }
        
        for(AggregateResult aggr : [Select AccountId, count(Id) countOpp from Opportunity 
                                    where AccountId in :accountIds AND isCLosed = false group by AccountId ]){
            accountWithOppCount.put((Id)aggr.get('AccountId'), (Integer)aggr.get('countOpp'));	
        }
        
        for(Opportunity opp : oppList){
            
            if(opp.AccountId == null || opp.isClosed) continue;
            
            Integer countOpp = accountWithOppCount.containsKey(opp.AccountId) ? accountWithOppCount.get(opp.AccountId) : 0;
            
            if( countOpp >=5){
                opp.addError('Max 5 open opportunities allowed per Account');
                continue;
            }
            accountWithOppCount.put(opp.AccountId, countOpp+1);
        }
        
    }
}