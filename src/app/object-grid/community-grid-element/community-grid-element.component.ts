import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../core/shared/community.model';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../+search-page/search-options.model';

@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@renderElementsFor(Community, ViewMode.Grid)
export class CommunityGridElementComponent extends ObjectGridElementComponent<Community> {}
