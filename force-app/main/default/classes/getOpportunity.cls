public with sharing class getOpportunity {

    @AuraEnabled(cacheable=true)
    public static List<String> getStageName(){
        List<String> pickListValuesList= new List<String>();
         Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
         List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
         for( Schema.PicklistEntry pickListVal : ple){
             pickListValuesList.add(pickListVal.getLabel());
         }
         return pickListValuesList;
     }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityByStage(String oppstageName,String orderByField,String orderBy){
            
            String query='SELECT '
            +'Id,Name,Amount,ExpectedRevenue,Owner.Name,CloseDate '
            +'FROM Opportunity';
            if(String.isNotBlank(oppstageName)){
                query+=' WHERE StageName = :oppstageName';
            }
            if(String.isNotBlank(orderByField)){
                query+=' ORDER BY '+orderByField;
            }
            if(String.isNotBlank(orderBy)){
                query+=' '+orderBy;
            }
            system.debug('cc get called');
            return Database.query(query);  

    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityById(String Id){
        List<Opportunity> res=new List<Opportunity>();
        try {
            String query='SELECT '
            +'Name, Amount, StageName, ExpectedRevenue '
            +'FROM Opportunity';
            if(String.isNotBlank(Id)){
                query+=' WHERE Id = :Id';
            }
            res=Database.query(query);            
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return res;
    }
    @AuraEnabled(cacheable=true)
    public static string methodName(){
        System.debug('method called');
        String res;
        try {
            system.debug('executed');
        } catch (Exception e) {
            System.debug(e.getMessage());
            system.debug('ERROR ');
        }
        return 'executed';
    }
}