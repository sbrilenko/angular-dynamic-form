import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Tranzzo} from "./payment-systems/tranzzo/Tranzzo";
import {PaymentSystemRule} from "./payment-systems/payment-system-rule.interface";
import {PaymentSystem} from "./payment-systems/payment-system.interface";
import {Checkout} from "./payment-systems/checkout/Checkout";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  standalone: true,
  styleUrls: ['./dynamic-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // Добавляем CommonModule в секцию imports
})
export class DynamicFormComponent implements OnInit {
  depositForm: FormGroup;
  rules: PaymentSystemRule | undefined;
  currentChoice = null;

  // Маппинг systemId к метаданным полей
  systemFieldsMapping: { [key: string]: PaymentSystem } = {
    [Tranzzo.SYSTEM_NAME]: new Tranzzo(),
    [Checkout.SYSTEM_NAME]: new Checkout(),
    // Добавьте метаданные полей для других систем при необходимости
  };

  systemOptions: { value: string, label: string}[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.systemOptions = Object.keys(this.systemFieldsMapping).map(key => ({ value: key, label: key}));
    this.depositForm = this.formBuilder.group({
      amount: [null, Validators.required],
      systemId: [null, Validators.required],
      system: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.handleFormChanges();
  }

  handleFormChanges() {
    this.system.valueChanges.subscribe(systemAlias => {
      // Очищаем предыдущие поля, чтобы избежать ошибок
      if (this.currentChoice !== null)
      this.clearAdditionalFields(this.currentChoice);

      // Добавляем дополнительные поля в зависимости от выбранного "systemAlias"
      this.addFieldsBasedOnSystemAlias(systemAlias);
      this.currentChoice = systemAlias
    });
  }

  addFieldsBasedOnSystemAlias(systemAlias: string) {

    // const fieldsToAdd = this.systemFieldsMapping[systemAlias] || [];
    const systemInstance  = this.systemFieldsMapping[systemAlias];
    const formElements = systemInstance.formElements();
    this.rules = systemInstance.getRules();


    let additionalFormGroup = new FormBuilder();
    let payloadGroup = additionalFormGroup.group({});
    // Добавляем дополнительные поля в форму
    const nestedForm = this.rules.nested;
    this.rules.controls.forEach(fieldConfig => {
      const { label, type , formControlName} = fieldConfig;
      const control = additionalFormGroup.control('', [Validators.required]);
      payloadGroup.addControl(formControlName, control);
      /* ага небольшые костыли но с твоим опытом - ты это легко пофиксишь оопешно ) */
      if (nestedForm === null) {
        this.depositForm.addControl(formControlName, control);
      }
    });
    /* вложенность?*/
   if (this.rules.nested !== null) {
     /* группа */
     this.depositForm.addControl(formElements.nested, payloadGroup);
   }
  }

  clearAdditionalFields(systemAlias: string) {
    const systemInstance  = this.systemFieldsMapping[systemAlias];
    const rules = systemInstance.getRules();

    // Удаляем дополнительные поля перед добавлением новых
    if (rules.nested !== null) {
      this.depositForm.removeControl(rules.nested);
    } else {
      rules.controls.forEach(fieldConfig => {
        const {label, type, formControlName} = fieldConfig;
        this.depositForm.removeControl(formControlName);
      })
    }
  }

  get system() {
    return this.depositForm.get('system') as FormControl;
  }

  onFormSubmit() {
    if (this.depositForm.valid) {
      console.log(this.depositForm.value);
    } else {
      console.log('form not valid ',this.depositForm)
    }
  }
}
