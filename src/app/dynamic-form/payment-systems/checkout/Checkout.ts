import { PaymentSystem } from '../payment-system.interface';
import {PaymentSystemRule} from "../payment-system-rule.interface";

export class Checkout implements PaymentSystem {
  static readonly SYSTEM_NAME = 'checkout';
  name = Checkout.SYSTEM_NAME;

  public getRules(): PaymentSystemRule {
    return {
        nested: null,
        controls: [
          { label: 'Some other field', type: 'text', formControlName: 'bankOnly' },
        ]};
  }

  public formElements() {
    const rules = this.getRules();
    return {nested: rules.nested, controls: rules.controls};
  }

}
