import { Component, Input } from '@angular/core';
import { FlatNode } from 'src/app/community-list-page/flat-node.model';

@Component({
  selector: 'ds-show-selected-collection',
  templateUrl: './show-selected-collection.component.html',
  styleUrls: ['./show-selected-collection.component.scss']
})
export class ShowSelectedCollectionComponent {

  @Input() selectedNode: FlatNode[] = [];
  content:string = "The document has to be displayed from ";
  constructor(){
    for(let j of this.selectedNode) {
      this.content = this.content + j.name + ",";  
    }
  } 
}
