import { PaymentSystem } from '../payment-system.interface';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PaymentSystemRule} from "../payment-system-rule.interface";

export class Tranzzo implements PaymentSystem {
  static readonly SYSTEM_NAME = 'tranzzo';
  name = Tranzzo.SYSTEM_NAME;

  public getRules(): PaymentSystemRule {
    return {
        nested: 'payload',
        controls: [
          { label: 'Credit Card Number', type: 'text', formControlName: 'ccNumber' },
          { label: 'Expiration Month', type: 'number', formControlName: 'expMonth'},
          { label: 'Expiration Year', type: 'number', formControlName: 'expYear'},
          { label: 'CVV', type: 'text', formControlName: 'cardCvv' }
        ]};
  }

  public formElements() {
    // Добавляем дополнительные поля в форму
    const rules = this.getRules();

    let formBuilder = new FormBuilder();
    let payloadGroup = formBuilder.group({});
    rules.controls.forEach(fieldConfig => {
      const { label, type , formControlName} = fieldConfig;
      const control = formBuilder.control('', [Validators.required]);
      payloadGroup.addControl(formControlName, control);
    });
    return {nested: rules.nested, controls: payloadGroup};
  }
  // Добавьте новые методы или измените существующие

}
