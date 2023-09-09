import { Component, Inject, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "No  "
  @Input() data: any;

  constructor(
                protected ref: NbDialogRef<ConfirmModalComponent>,
               ) { 
    
  //  this.dialogRef.updateSize('500px','156px')
                }

  ngOnInit(): void {
    if(this.data){
      this.message = this.data.message || this.data;
      if (this.data.buttonText) {
        this.confirmButtonText = this.data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = this.data.buttonText.cancel || this.cancelButtonText;
      }
   }
  }

public onConfirmClick(): void {
    this.ref.close(true);
  }
  public cancel() {
    this.ref.close();
  }

}