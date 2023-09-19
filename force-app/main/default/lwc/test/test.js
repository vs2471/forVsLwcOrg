import { LightningElement, wire } from 'lwc';
import getName from '@salesforce/apex/getOpportunity.methodName';
export default class Test extends LightningElement {
    value;
    @wire(getName,{name:'$value'})
    wiredName({error,data}){
        if(data){
            console.log('not null');
        }
        if(data==null){
            this.value=data;
            console.log('abc');
        }else if(error){
            console.log('def');
        }
    }
    // @wire(getName,{name:'$value'})
    // wiredName1({error,data}){
    //     if(data){
    //         console.log('abc');
    //     }else if(error){
    //         console.log('efg');
    //     }
    // }
    handleSubmit(event){
        this.value=event.detail.value;

    }
}