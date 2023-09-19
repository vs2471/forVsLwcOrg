import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
//getting picklist value directly from schema
import STAGE from '@salesforce/schema/Opportunity.StageName';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
//getting picklist value from apex method
import getStageName from '@salesforce/apex/getOpportunity.getStageName';


export default class OpportunitySearch extends LightningElement {
    selectedOpp='';
    selectedField='Name';
    selectedSortBy='ASC';
    @track stageNameValues;
    //get stage name picklist values from schema
    // @wire(getObjectInfo,
    //     {
    //         objectApiName:OPPORTUNITY_OBJECT
    //     }
    // )opportunityInfo
    // @wire(getPicklistValues,
    //     {
    //         recordTypeId:'$opportunityInfo.data.defaultRecordTypeId',
    //         fieldApiName: STAGE
    //     }
    // )stageValues
    @wire(getStageName)
    wiredGetStageName(result){
        if(result.data){
            //console.log(result.data);
            let options=[];
            for(var i in result.data){
                options.push({label:result.data[i],value:result.data[i]});
            }
            options.unshift({label:'All',value:''});
            //console.log(options);
            this.stageNameValues=options;
        }
        else if(result.error){
            console.log(result.error.message());
        }
    }
    
    handleSearchOptionChange(event){
        this.selectedOpp=event.target.value;
        console.log(this.selectedOpp);
    }
    handleFieldOptionChange(event){
        this.selectedField=event.target.value;
        console.log(this.selectedField);
    }
    handlesortByOptionChange(event){
        this.selectedSortBy=event.target.value;
        console.log(this.selectedSortBy);
    }
    newOpportunity(event){
        
    }
    get FieldValues(){
        return[
            {label:'Id',value:'Id'},
            {label:'Name',value:'Name'},
            {label:'Amount',value:'Amount'},
            {label:'ExpectedRevenue',value:'ExpectedRevenue'},
            {label:'CloseDate',value:'CloseDate'}
        ];
    }
    get sortByValues(){
        return [
            {label:'Ascending',value:'ASC'},
            {label:'Descending',value:'DESC'}
        ];
    }
}