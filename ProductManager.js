const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.productIdCounter = 1;
        this.path = filePath;
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (Array.isArray(this.products) && this.products.length > 0) {
                this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
            }
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    saveProductsToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data, 'utf8');
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error.message);
        }
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock } = productData;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.error("Ya existe un producto con el mismo código");
            return;
        }

        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
        this.saveProductsToFile();
        console.log(`Producto agregado: ${product.title}`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
            return null;
        }
    }

    updateProduct(id, updatedProductData) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProductData };
            this.saveProductsToFile();
            console.log(`Producto actualizado con ID ${id}`);
        } else {
            console.error("Producto no encontrado");
        }
    }


    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProductsToFile();
            console.log(`Producto eliminado con ID ${id}`);
        } else {
            console.error("Producto no encontrado");
        }
    }
}

