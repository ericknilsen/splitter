import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/common/util';
import {PaymentsService } from 'src/app/services/payments.service';
import { Payment } from 'src/app/models/payment.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  form: FormGroup;
  isSubmited: boolean = false;
  
  user: any;
  paidUser: any;
  groupUsers: any[] = [];

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private paymentsService: PaymentsService) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'amount': new FormControl('', Validators.required),
      'date': new FormControl(Util.getCurrentDate(), Validators.required),
      'paidUser': new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.initCurrentUser();
    this.listUserGroupOfUser();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  onSubmit(payment: Payment): void {
    payment.status = 'Pending';
    payment.chargedUser = this.user.email;
    this.paymentsService.add(payment).subscribe(resp => {
      this.isSubmited = true;
    });

    this.form = this.initForm();
    this.setPaidUser();
  }

  get f() { return this.form.controls; }

  private listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.groupUsers = userGroup.users.filter(u => u !== this.user.email);
      this.setPaidUser();
    })
  }

  private setPaidUser() {
    if (this.groupUsers.length === 1) {
      this.paidUser = this.groupUsers[0];
      this.form.patchValue({'paidUser': this.paidUser});
    }
  }
}
