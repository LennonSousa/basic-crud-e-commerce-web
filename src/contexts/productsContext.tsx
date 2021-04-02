import React, { useState, createContext } from 'react';

import { Product } from '../components/Products';

interface ProductsContextData {
    products: Product[];
    handleProducts(products: Product[]): void;
}

const ProductsContext = createContext<ProductsContextData>({} as ProductsContextData);

const ProductsProvider: React.FC = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);

    function handleProducts(products: Product[]) {
        setProducts(products);
    }

    return (
        <ProductsContext.Provider value={{ products, handleProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

export { ProductsContext, ProductsProvider };