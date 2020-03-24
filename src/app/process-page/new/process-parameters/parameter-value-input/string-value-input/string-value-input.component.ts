import { Component, OnInit } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

@Component({
  selector: 'ds-string-value-input',
  templateUrl: './string-value-input.component.html',
  styleUrls: ['./string-value-input.component.scss']
})
export class StringValueInputComponent extends ValueInputComponent<string> {
  value: string;

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value)
  }
}
