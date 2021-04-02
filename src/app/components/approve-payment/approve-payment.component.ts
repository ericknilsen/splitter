import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from 'src/app/common/util';
import { Payment } from 'src/app/models/payment.model';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-approve-payment',
  templateUrl: './approve-payment.component.html',
  styleUrls: ['./approve-payment.component.css']
})
export class ApprovePaymentComponent implements OnInit {

  @Input()
  pendingPayments!: Payment[];    

  @Output()
  submited: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  offset: any;
  pendingPaymentsFormArray!: FormArray;
  
  actionsList: string[] = [];

  actionStatusMap: Map<string, string> = new Map();

  isDisplayedList: boolean[] = [];

  constructor(private fb: FormBuilder,
    private paymentsService: PaymentsService) { 
    this.form = this.initForm();
  }

  ngOnInit(): void {
    this.setTimezoneOffset();
    this.initActionsList();
    this.initPendingPaymentFormArray();
    this.initDisplayedList();
  }

  onSubmit(): void {
    const actions = this.pendingPaymentsFormArray.value;
    for(let i = 0; i < actions.length; ++i) {
      this.pendingPayments[i].status = actions[i].action;
    }
    
    this.paymentsService.update(this.pendingPayments).subscribe(resp => {
      this.submited.emit();
      this.paymentsService.emitPaymentsChange();
    })
    
  }  

  private initForm() {
    return this.fb.group({
      pendingPaymentsFormArray: this.fb.array([])
    });
  }

  private createPendingPayments(): FormGroup {
    return this.fb.group({
      action: ['', Validators.required]
    });
  }

  private initActionsList() {
    this.actionStatusMap = Util.getActionStatusMap();
    this.actionsList = Array.from(this.actionStatusMap.keys());
  }

  private addNewPendingPaymentToFormArray() {
    this.pendingPaymentsFormArray.push(this.createPendingPayments());
  }

  private initPendingPaymentFormArray() {
    this.pendingPaymentsFormArray = this.form.get('pendingPaymentsFormArray') as FormArray;
    for(let i = 0; i < this.pendingPayments.length; ++i) {
      this.addNewPendingPaymentToFormArray();
    }
  }

  displayPaymentDetails(index: number) {
    this.isDisplayedList[index] = !this.isDisplayedList[index]; 
  }

  private initDisplayedList() {
    for (let i = 0; i < this.pendingPayments.length; ++i) {
      this.isDisplayedList[i] = false; 
    }
  }

  setTimezoneOffset() {
    this.offset = Util.getTimezoneOffset();
  }
}
