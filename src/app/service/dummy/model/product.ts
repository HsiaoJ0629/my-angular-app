export class Product {
  id: number = 0;
  title: string = '';
  description: string = '';
  category: string = '';
  price: number = 0;
  discountPercentage: number = 0;
  rating: number = 0;
  stock: number = 0;
  tags: string [] = [];
  brand: string = '';
  sku: string = '';
  weight: number = 0;
  dimensions: Dimensions = new Dimensions();
  warrantyInformation: string = '';
  shippingInformation: string = '';
  availabilityStatus: string = '';
  reviews: Review[] = [];
  returnPolicy: string = '';
  minimumOrderQuantity: number = 0;
  meta: Meta = new Meta();
  thumbnail: string = '';
  images: string[] = [];
}

export class Review {
  rating: number = 0;
  comment: string = '';
  date: string = '';
  reviewerName: string = '';
  reviewerEmail: string = '';
}

export class Dimensions {
  width: number = 0;
  height: number = 0;
  depth: number = 0;
}

export class Meta {
  createdAt: string = '';
  updatedAt: string = '';
  barcode: string = '';
  qrCode: string = '';
}

