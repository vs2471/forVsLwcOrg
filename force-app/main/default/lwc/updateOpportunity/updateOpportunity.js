import { LightningElement } from 'lwc';
import { wire } from 'lwc';
import OPPMC from '@salesforce/messageChannel/OpportunityMessageChannel__c';
import OPPUMC from '@salesforce/messageChannel/OpportunityUpdateMessageChannel__c';
import { subscribe, MessageContext, unsubscribe, APPLICATION_SCOPE, publish } from 'lightning/messageService';
//import apex method
import getOppById from '@salesforce/apex/getOpportunity.getOpportunityById';
//import toast message
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class UpdateOpportunity extends LightningElement {
    subscription=null;
    oppId;
    opportunity;
    isLoading;
    @wire(MessageContext)
    messageContext;
    subscrimeMC(){
        if(this.subscription || this.oppId){
            return;
        }
        this.subscription=subscribe(
            this.messageContext,
            OPPMC,
            (message)=>{this.oppId=message.recordId},
            {scope:APPLICATION_SCOPE}
        );

    }
    unSubscribeMC(){
        unsubscribe(this.subscription);
        this.subscription=null;
    }
    connectedCallback(){
        // console.log('update opp Connected')
        this.subscrimeMC();
    }
    disconnectedCallback(){
        this.unSubscribeMC();
    }
    get show(){
        if(this.oppId)return true;
        return false;
    }
    get recordId(){
        return this.oppId;
    }
    get loading(){
        return this.isLoading;
    }
    @wire(getOppById,{Id:'$oppId'})
    getOppById({error,data}){
        if(!data && !error){
            this.isLoading=true;
        }else if(error){
            const evt = new ShowToastEvent({
                title: 'ERROR',
                message:error,
                variant: 'error'
            });
            this.dispatchEvent(evt);
        }else if(data){
            this.opportunity=data;
            this.isLoading=false;
        }
    }
    handleSuccess(event){
        //sending relaod value from update cmp
        const payload={reload:true};
        publish(this.messageContext,OPPUMC,payload);
    }
}