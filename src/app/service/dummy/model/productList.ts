import { Product } from "./product";

export class ProductList{
    products: Product[] = [];
    total: number = 0;
    skip: number = 0;
    limit: number = 10;
}