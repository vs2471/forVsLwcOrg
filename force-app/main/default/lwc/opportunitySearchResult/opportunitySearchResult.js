import { LightningElement } from 'lwc';
import { api,wire,track } from 'lwc';
import { publish, MessageContext,subscribe, APPLICATION_SCOPE, unsubscribe } from 'lightning/messageService';
//import apex class
import getOppByStage from '@salesforce/apex/getOpportunity.getOpportunityByStage';

import {refreshApex} from '@salesforce/apex';
//import message channel
import OPPMC from '@salesforce/messageChannel/OpportunityMessageChannel__c';
import OPPUMC from '@salesforce/messageChannel/OpportunityUpdateMessageChannel__c';
//import toast message
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class OpportunitySearchResult extends LightningElement {
    @api stageName='';
    @api sortByField='';
    @api sortBy='';
    @track opportunity;
    @track wiredOpportunity;
    isLoading;
    selectedOppId;
    size='';
    subscription=null;
    needRefresh=false;
    //colums for data table
    columns=[
        {label:'Id',fieldName:'Id'},
        {label:'Name',fieldName:'Name'},
        {label:'Amount',fieldName:'Amount',type: 'currency'},
        {label:'ExpectedRevenue',fieldName:'ExpectedRevenue',type: 'currency'},
        {label:'Close Data',fieldName:'CloseDate',type:'Date'}
    ];
    @wire(MessageContext)
    messageContext;
    get title(){
        return `${this.stageName} Opportunity`;
    }
    get loading(){
        return this.isLoading;
    }
    //event triggered from child with selected tile opportunity id
    updateSelectedTile(event){
        // console.log(`id from parent ${event.detail.oppId}`);
        this.selectedOppId=event.detail.oppId;
        this.sendMessageService(this.selectedOppId);

    }
    sendMessageService(oppId){
        const payload={recordId:oppId};
        publish(this.messageContext,OPPMC,payload);

    }
    //retreive opportunity data from apex method by passing the stagename
    @wire(getOppByStage,{oppstageName:'$stageName',orderByField:'$sortByField',orderBy:'$sortBy'})
    wiredOppo(result){
        this.wiredOpportunity=result;
        if(!result.data && !result.error){
            this.isLoading=true;
        }
        if(result.data){
            this.opportunity=result.data;
            
            this.isLoading=false;
        }else if(result.error){
            const evt = new ShowToastEvent({
                title: 'ERROR',
                message:"Error",
                variant: 'error'
            });
            this.dispatchEvent(evt);
        }
    }
    
    connectedCallback(){
        this.subscribeMC();
    }
    disconnectedCallback(){
        this.unsubscribeMC();
    }
    unsubscribeMC(){
        unsubscribe(this.subscription);
        this.subscription=null;
    }
    //receive message when data updated from updateopportunity compoenent 
    //and refresh the wired opportunity record
    subscribeMC(){
        //return if already subscribed
        if(this.subscription || this.needRefresh){
            return;
        }
        this.subscription=subscribe(
            this.messageContext,
            OPPUMC,
            (message)=>{this.processMsg(message.reload)},
            {scope:APPLICATION_SCOPE}
        );
    }
    processMsg(msg){
        if(msg){
            this.refresh();
        }
    }
    refresh(){
        refreshApex(this.wiredOpportunity).then(
            ()=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'success',
                        message:'Data Refreshed',
                        variant:'success'
                    })
                );
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Error',
                        message:message,
                        variant:'error'
                    })
                );
            });
    }


}