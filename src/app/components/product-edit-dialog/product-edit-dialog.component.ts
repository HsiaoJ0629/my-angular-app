import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../service/dummy/model/product';
import { DummyService } from '../../service/dummy/dummy.service';

@Component({
  selector: 'app-product-edit-dialog',
  imports: [ MaterialModule ],
  templateUrl: './product-edit-dialog.component.html',
  styleUrl: './product-edit-dialog.component.scss'
})
export class ProductEditDialogComponent {

  isSave: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
     private dialogRef: MatDialogRef<ProductEditDialogComponent>,
     private dummyService: DummyService,
  ) { }

  save(){
    if(this.data.product.id > 0) this.updateProduct(); 
    else this.addProduct();
  }

  addProduct(){
    this.dummyService.addProduct(this.data.product).subscribe(data =>{
      this.data.product = data;
      this.isSave = true;
      this.dummyService.showAlert('success', 'Product added');
    }, error=>{
      this.dummyService.showAlert('error', 'Product add failed');

    })
  }

  updateProduct(){
    this.dummyService.updateProduct(this.data.product).subscribe(data =>{
      this.data.product = data;
      this.isSave = true;
      this.dummyService.showAlert('success', 'Product updated');
    }, error=>{
      this.dummyService.showAlert('error', 'Product update failed');
    })
  }
  

  close() {

    this.dialogRef.close({save: this.isSave, product: this.data.product});
  }
}


interface DialogData{
  product: Product,
  title: string
}