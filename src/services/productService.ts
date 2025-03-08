import productModel from "../models/productModel";

export const getAllProducts = async () => {
    return await productModel.find();
}

export const seedInitialProducts = async () => {
    const seedProducts = [
        {
            title: "Laptop", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm7P7RTpuupZF-liRnjHHNC4DSCE8j3EMPzA&s",price: 12000, stock: 20  
        }
    ];

    const products = await getAllProducts();

    if (products.length === 0) {
        await productModel.insertMany(seedProducts)
    }

};