import { Component, Input, Injector, ReflectiveInjector, OnInit } from '@angular/core';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator'
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { ViewMode } from '../../+search-page/search-options.model';

@Component({
  selector: 'ds-wrapper-list-element',
  styleUrls: ['./wrapper-list-element.component.scss'],
  templateUrl: './wrapper-list-element.component.html'
})
export class WrapperListElementComponent implements OnInit {
  @Input() object: ListableObject;
  objectInjector: Injector;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.objectInjector = ReflectiveInjector.resolveAndCreate(
      [{provide: 'objectElementProvider', useFactory: () => (this.object) }], this.injector);
  }

  getListElement(): string {
    const f: GenericConstructor<ListableObject> = this.object.constructor as GenericConstructor<ListableObject>;
    return rendersDSOType(f, ViewMode.List);
  }
}
