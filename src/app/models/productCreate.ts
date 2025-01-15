export interface ProductCreate {
    name: string 
    description: string | null
    price: number
    brand: string 
    color: string 
    size: string | null
    count: number 
    
    category_id: number
}