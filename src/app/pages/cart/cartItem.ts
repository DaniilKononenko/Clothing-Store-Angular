export class CartItem {
    constructor(
        public id: number,
        public name: string,
        public imageUrl: string | null,
        public price: number,
        public quantity: number = 1
    ) { }

    getTotalPrice(): number {
        return this.price * this.quantity
    }
}
