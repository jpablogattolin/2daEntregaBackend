const fs = require ('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.cargarProductos();
  }

  cargarProductos() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(productData) {
    const id = this.products.length > 0 ? this.products[this.products.length - 1].ID + 1 : 1;
    const product = { ID: id, ...productData };
    this.products.push(product);
    this.saveProducts();
    return product;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.ID === id);
  }

  updateProduct(id, updatedData) {
    const productIndex = this.products.findIndex((product) => product.ID === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedData };
      this.saveProducts();
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.ID !== id);
    if (this.products.length !== initialLength) {
      this.saveProducts();
      return true;
    }
    return false;
  }
}


const productManager = new ProductManager('products.json');

const product1 = {
  title: 'Producto 1',
  description: ' producto 1',
  price: 1000,
  code: '001',
  stock: 30,
};

const product2 = {
  title: 'Producto 2',
  description: ' producto 2',
  price: 1500,
  code: '002',
  stock: 25,
};

const newProduct = productManager.addProduct(product1);
console.log('Nuevo producto agregado:', newProduct);

productManager.addProduct(product2);
console.log('Lista de productos:', productManager.getProducts());

const updatedProductData = {
  title: 'Producto Modificado',
  price: 800,
  stock: 40,
};

const productIdToUpdate = 1;
if (productManager.updateProduct(productIdToUpdate, updatedProductData)) {
  console.log('Producto actualizado:', productManager.getProductById(productIdToUpdate));
} else {
  console.log('El producto con el ID especificado no fue encontrado.');
}

const productIdToDelete = 2;
if (productManager.deleteProduct(productIdToDelete)) {
  console.log('Producto eliminado. Lista de productos actualizada:', productManager.getProducts());
} else {
  console.log('El producto con el ID especificado no fue encontrado.');
}