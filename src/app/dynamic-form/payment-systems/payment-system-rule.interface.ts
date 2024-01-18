export interface PaymentSystemRule {
  nested: string | null;
  controls: Control[]
}

interface Control {
  label: string;
  type: string | 'number';
  formControlName: string
}
