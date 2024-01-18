import {PaymentSystemRule} from "./payment-system-rule.interface";
export interface PaymentSystem {
  name: string;
  getRules(): PaymentSystemRule;
  formElements(): any;
}
