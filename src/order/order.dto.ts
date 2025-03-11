export class OrderDto {
  items: number[];
  total_quantity: number;
  total_price: number;
  first_book_title: string;
  delivery: Delivery;
}

export class Delivery {
  address: string;
  receiver: string;
  contact: string;
}
