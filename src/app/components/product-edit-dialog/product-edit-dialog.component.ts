import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../service/dummy/model/product';

@Component({
  selector: 'app-product-edit-dialog',
  imports: [ MaterialModule ],
  templateUrl: './product-edit-dialog.component.html',
  styleUrl: './product-edit-dialog.component.scss'
})
export class ProductEditDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
     private dialogRef: MatDialogRef<ProductEditDialogComponent>
  ) { }
  

  cancel() {
    this.dialogRef.close();
  }
}


interface DialogData{
  product: Product
}