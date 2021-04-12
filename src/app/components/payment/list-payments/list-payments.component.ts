import { Component, OnInit } from '@angular/core';
import { Util } from 'src/app/common/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalConfirm } from 'src/app/common/delete.modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE } from 'src/app/common/constants';
import { Payment } from 'src/app/models/payment.model';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.css']
})
export class ListPaymentsComponent implements OnInit {
  payments: Payment[] = [];
  paymentsSize: number = 0;
  page = 1;
  pageSize = PAGE_SIZE;
  searchParams: any;
  user: any;
  offset: any;

  constructor(private paymentsService: PaymentsService,
              private spinnerService: NgxSpinnerService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initCurrentUser();
    this.setTimezoneOffset();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  deletePayment(payment: Payment) {
    const modalRef = this.modalService.open(DeleteModalConfirm);
    modalRef.componentInstance.modalTitle = 'Delete Payment';
    modalRef.componentInstance.modalBody = 'Payment to '+this.getUsernameFromEmail(payment.paidUser);
    modalRef.closed.subscribe(() => {
      this.spinnerService.show();
      this.paymentsService.delete(payment).subscribe(() => {
        this.searchPayments();
        this.paymentsService.emitPaymentsChange();
        this.spinnerService.hide();
      })
    });
  }

  isEditable(payment: Payment) {
    return payment.chargedUser === this.user.email;
  }

  searchPayments(searchParams?: any) {
    this.spinnerService.show();
    if (searchParams) {
      this.searchParams = searchParams;
    }
    this.searchParams.userEmail = this.user.email;

    this.paymentsService.searchSize(this.searchParams).subscribe(size => {
      this.paymentsSize = size;
      this.loadPage(1);
    })   
  }

  private search(page: number) {
    this.searchParams.page = page;
    this.searchParams.limit = PAGE_SIZE;
    this.paymentsService.search(this.searchParams).subscribe(result => {
      this.payments = result;
      this.spinnerService.hide();
    })
  }

  setTimezoneOffset() {
    this.offset = Util.getTimezoneOffset();
  }

  getUsernameFromEmail(email: string) {
    return Util.getUsernameFromEmail(email);
  }

  loadPage(page: number) {
    this.search(page);
    this.page = page;
  }
}
