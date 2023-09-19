import { LightningElement } from 'lwc';

export default class QuizApp extends LightningElement {
    selected={}
    correctAnsweres=0
    isSubmitted=false;
    myQuestions=[
        {
            id:"Question1",
            question:"Which one of the following is not a template loop",
            answere:{
                a:"for:each",
                b:"iterator",
                c:"map loop"
            },
            correctAnswere:"c"
        },
        {
            id:"Question2",
            question:"Which one of the file is invalid in LWC component folder",
            answere:{
                a:".svg",
                b:".apex",
                c:".js"
            },
            correctAnswere:"b"
        },
        {
            id:"Question3",
            question:"Which one of the file is not a directive",
            answere:{
                a:"for:each",
                b:"if:true",
                c:"@track"
            },
            correctAnswere:"c"
        }
    ]
    get allNotSelected(){
        return !(Object.keys(this.selected).length===this.myQuestions.length)
    }
    get isScoredFull(){
        return `slds-text-heading_large ${this.myQuestions.length===this.correctAnsweres?
            'slds-text-color_success':'slds-text-color_error'}`
    }
    handleChange(event){
        const {name,value}=event.target;
        this.selected={...this.selected,[name]:value}
    }
    submitHandler(event){
        event.preventDefault()
        let crt=this.myQuestions.filter(item=>this.selected[item.id]===item.correctAnswere)
        this.correctAnsweres=crt.length
        this.isSubmitted=true
    }
    resetHandler(event){
        this.selected={}
        this.correctAnsweres=0
        this.isSubmitted=false
    }
}