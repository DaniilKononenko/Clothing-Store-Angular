export interface Product {
    id: number,
    name: string 
    description: string | null
    price: number
    image_url: string | null
    brand: string 
    color: string 
    size: string | null
    count: number 
    
    category_id: number
}
