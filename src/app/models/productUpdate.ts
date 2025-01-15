export interface ProductCreate {
    id: number | null
    name: string | null 
    description: string | null
    price: number | null
    brand: string | null 
    color: string | null 
    size: string | null
    count: number | null 
    
    category_id: number | null
}

//export type ProductUpdate = Partial<ProductCreate>