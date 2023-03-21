
const fs = require("fs").promises;

class ProductManager {
  idAuto = 0;
  #products = [];
  path = ``;

  constructor() {
    this.#products = [];
    this.path = `./products.json`;
  }

  async getProducts() {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      return JSON.parse(productFile);
    } catch (error) {
      await fs.writeFile(this.path, "[]");
      return "File doesn't exist.";
    }
  }

  async addProducts(product) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let newProduct = JSON.parse(productFile);

      const valid = newProduct.find(
        (p) => p.id === product.id,
      );

      if (valid) {
        throw new Error("Wrong ID");
      }

      if (newProduct.length > 0) {
        const lastProduct = newProduct[newProduct.length - 1];
        this.idAuto = lastProduct.id + 1;
      }

      newProduct.push({
        id: this.idAuto++,
        ...product,
      });

      await fs.writeFile(this.path, JSON.stringify(newProduct, null, 2));
      return "Object added successfully";
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(id) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let idProduct = JSON.parse(productFile);

      const searchProduct = idProduct.find((p) => p.id === id);

      if (!searchProduct) {
        throw new Error("Product not found");
      }
      return searchProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(id, product) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let products = JSON.parse(productFile);

      const idProduct = products.findIndex((p) => p.id === id);

      products.splice(idProduct, 1, { id, ...product });

      await fs.writeFile(this.path, JSON.stringify(products, null, 2));

      return "Product modified.";
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteProduct(id) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let products = JSON.parse(productFile);

      const idProduct = products.find((p) => p.id === id);

      if (!idProduct) {
        throw new Error("ID doesn't exist");
      }
      const deletedProducts = products.filter((p) => p.id !== id);

      await fs.writeFile(this.path, JSON.stringify(deletedProducts, null, 2));

      return "Product deleted successfully.";
    } catch (error) {
      throw new Error(error);
    }
  }
}

const product1 = {  title: 'Pelota',
                    description: 'Pelota de fútbol',
                    price: 5000,
                    thumbnail: './img1.jpg',
                    stock: 200,
                    id: this.idAuto
};

const productManager = new ProductManager();

const generate = async () => {
  console.log(await productManager.addProducts({ ...product1, id: this.idAuto}));
  console.log(await productManager.getProducts());
};

generate();

const main = async () => {
  console.log("Products List: ", await productManager.getProducts());
  console.log("Found Products: ", await productManager.getProductById(0));

  console.log(await productManager.updateProduct(0, { ...product1, title: "Pelota Puma" }));
  console.log("Modified Product", await productManager.getProducts());

  console.log(await productManager.deleteProduct(0));
  console.log("Deleted Product", await productManager.getProducts());
};

main();
