  import { cartModel, ICart, ICartItems } from '../models/cartModel';
  import productModel from '../models/productModel';
  import userModel from "../models/userModel";

  interface CreateCartForUser {
    userId: string;
  }

  const createCartForUser = async ({ userId }: CreateCartForUser) => {
    const cart = await cartModel.create({ userId, totalAmount: 0 as number });
    await cart.save();
    return cart;
  };

  interface GetActiveCartForUser {
    userId: string;
  }

  export const getActiveCartForUser = async ({
    userId,
  }: GetActiveCartForUser) => {
    let cart = await cartModel.findOne({ userId, status: "active" });

    if (!cart) {
      cart = await createCartForUser({ userId });
    }
    return cart;
};
// clear cart
interface ClearCart{
  userId: string;

}
  
export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
  
}

// add item to cart
  interface AddItemToCart {
    productId: any;
    quantity: number;
    userId: string;
  }

  export const addItemToCart = async ({
    productId,
    quantity,
    userId,
  }: AddItemToCart) => {
    const cart = await getActiveCartForUser({ userId });

    const existsInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );

    if (existsInCart) {
      return { data: "item already exists in cart!", statusCode: 400 };
    }
    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }

    if (Number(product.stock) < quantity) {
      return { data: "low stock for item", statusCode: 400 };
    }
    cart.items.push({
      product: productId,
      unitPrice: product.price,
      quantity,
    });

    //update TotalAmount for the cart
    cart.totalAmount += Number(product.price) * quantity;

    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
  };

  //cart update
  interface UpdateItemInCart {
    productId: any;
    quantity: number;
    userId: string;
  }

  export const updateItemInCart = async ({
    productId,
    quantity,
    userId,
  }: UpdateItemInCart) => {

    const cart = await getActiveCartForUser({ userId });

    const existsInCart = cart.items.find(
      (p) => {
        return p.product.toString() === productId;
      }
    );

    if (!existsInCart) {
      return { data: "item does not exists in cart!", statusCode: 400 };
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }

    if (Number(product.stock) < quantity) {
      return { data: "low stock for item", statusCode: 400 };
    }

    

    //update TotalAmount for the cart
    const otherCartItems = cart.items.filter(
      (p) => p.product.toString() !== productId
    );

      let total = calculateCartTotalItem({ cartItems: otherCartItems})


    existsInCart.quantity = quantity;
    
    total += Number(existsInCart.quantity) * Number(existsInCart.unitPrice);
    cart.totalAmount = total;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
  };


// delete item

interface DeleteItemInCart {
  productId: any;
  userId: string;
}
 export const  deleteItemInCart = async ({ userId, productId }: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "item does not exists in cart!", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
   );
   cart.items = otherCartItems;


   let total = calculateCartTotalItem({ cartItems: otherCartItems})

  cart.totalAmount = total;

  const deleteCart = await cart.save();
  return { data: deleteCart, statusCode: 200 };

}

const calculateCartTotalItem = ({ cartItems }: { cartItems: ICartItems[]; }) => {
   

  const total = cartItems.reduce((sum: number, product) => {
    sum += Number(product.quantity) * Number(product.unitPrice);
    return sum;
  }, 0);
  
  return total;

};

export default getActiveCartForUser;
