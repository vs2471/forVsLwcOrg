import { LightningElement } from 'lwc';
import { api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
export default class OppTile extends LightningElement {
    @api opportunity;
    @api oppId;
    get tileClass(){
        if(this.oppId===this.opportunity.Id){
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    selectedTile(event){
        const oppselect=new CustomEvent('oppselect',{
            detail:{
                oppId:this.opportunity.Id,
            }
        })
        this.dispatchEvent(oppselect);
    }
}