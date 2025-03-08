import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes"
import { seedInitialProducts } from './services/productService';
import productRoutes from './routes/productRoutes';
import cartRoute from './routes/cartRoute';

const app = express();
const Port = 3001;

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/eCommerce')
    .then(() => console.log("mongo connect!"))
    .catch((err) => console.log("failed to connect", err));


//   seed the products 
seedInitialProducts(); 


app.use('/User', userRoutes);
app.use('/products',productRoutes)
app.use('/cart',cartRoute)

app.listen(Port, () => {
    console.log(`server running at port: ${Port}`);
});
