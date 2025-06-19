import { Component, OnInit, ViewChild } from '@angular/core';
import { DummyService } from '../../service/dummy/dummy.service';
import { MaterialModule } from '../../modules/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Product } from '../../service/dummy/model/product';

@Component({
  selector: 'app-demo',
  imports: [ MaterialModule ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['title', 'price', 'stock'];
  pageSize: number = 10;
  pageIndex: number = 0
  totalLength: number = 0;
  isLoading: boolean = false;
  filterValue: string = '';
  constructor(
    private dummyService: DummyService
  ) { 
    this.getProducts();

  }


  ngOnInit(): void {

  }
  
  getProducts() {
    this.isLoading = true;
    this.filterValue = '';
    this.applyFilter(this.filterValue)
    this.dummyService.getProducts(this.pageSize, this.pageIndex * this.pageSize).subscribe(data => {
      this.dataSource.sort = this.sort;
      this.dataSource.data = data.products;
      
      this.totalLength = data.total;
      this.isLoading = false;
    })
  }

  onPageEvent(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getProducts()
  }

  applyFilter(event: any) {
    const filterValue = event.target ? (event.target as HTMLInputElement).value : event;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
