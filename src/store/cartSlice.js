import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequest, getRequest, deleteRequest, putRequest } from '../Services/apiMethods';

// Async thunks for API operations
export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({ product, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      if (!product || !product._id) {
        throw new Error("Invalid product data");
      }

      const cartData = {
        items: [
          {
            productId: product._id,
            quantity: quantity || 1,
            price: product.basicPrice
          }
        ]
      };

      console.log("Sending cart data:", cartData);

      const response = await postRequest("/carts/addToCart", cartData, token);
      console.log("Cart API response:", response);

      if (!response) {
        throw new Error("No response from server");
      }

      if (response.success) {
        const updatedCart = await getRequest("/carts/getCart/ByToken", token);
        console.log("Updated cart:", updatedCart);

        if (updatedCart.isSuccess && updatedCart.data) {
          return updatedCart.data;
        }
        throw new Error("Failed to fetch updated cart");
      }

      throw new Error(response.message || "Failed to add to cart");
    } catch (error) {
      console.error("Cart API error:", error);
      return rejectWithValue({
        message: error.message || "Failed to add item to cart",
        error: error
      });
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await getRequest("/carts/getCart/ByToken", token);
      console.log("Cart API Response:", response); // Debug log
      if (response.isSuccess && response.data) {
        return response.data;
      }
      throw new Error("Failed to fetch cart items");
    } catch (error) {
      console.error("Cart fetch error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async ({ cartId, productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const payload = {
        productId: productId,
        quantity: quantity
      };

      const response = await deleteRequest(`/carts/delete/${cartId}`, payload, token);
      console.log("Remove API Response:", response); // Debug log
      
      if (response.success) {
        // Fetch updated cart after removal
        const updatedCart = await getRequest("/carts/getCart/ByToken", token);
        if (updatedCart.isSuccess && updatedCart.data) {
          return updatedCart.data;
        }
      }
      throw new Error(response.message || "Failed to remove from cart");
    } catch (error) {
      console.error("Remove error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ cartId, items }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await putRequest(`/carts/${cartId}`, { items }, token);
      console.log("Update API Response:", response); // Debug log
      
      if (response.isSuccess) {
        const updatedCart = await getRequest("/carts/getCart/ByToken", token);
        return updatedCart.data;
      }
      throw new Error(response.message || "Failed to update cart");
    } catch (error) {
      console.error("Update error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to calculate cart totals
const updateCartTotals = (items) => {
  if (!Array.isArray(items)) {
    console.warn("Items is not an array:", items);
    return { totalItems: 0, totalPrice: 0 };
  }
  
  const totalItems = items.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);
  
  const totalPrice = items.reduce((total, item) => {
    return total + (Number(item.price) * (Number(item.quantity) || 0));
  }, 0);
  
  return { totalItems, totalPrice };
};

const initialState = {
  cartData: {
    items: [],
    totalItems: 0,
    totalPrice: 0
  },
  status: 'idle',
  error: null,
  lastUpdated: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (!state.cartData) {
        state.cartData = {
          items: [],
          totalItems: 0,
          totalPrice: 0
        };
      }
      
      if (!Array.isArray(state.cartData.items)) {
        state.cartData.items = [];
      }
      
      const existingItem = state.cartData.items.find(item => item.productId === action.payload._id);
      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + (Number(action.payload.quantity) || 1);
      } else {
        state.cartData.items.push({
          productId: action.payload._id,
          quantity: Number(action.payload.quantity) || 1,
          price: Number(action.payload.basicPrice)
        });
      }
      
      const { totalItems, totalPrice } = updateCartTotals(state.cartData.items);
      state.cartData.totalItems = totalItems;
      state.cartData.totalPrice = totalPrice;
      state.lastUpdated = new Date().toISOString();
    },
    removeFromCart: (state, action) => {
      state.cartData.items = state.cartData.items.filter(item => item.id !== action.payload);
      const { totalItems, totalPrice } = updateCartTotals(state.cartData.items);
      state.cartData.totalItems = totalItems;
      state.cartData.totalPrice = totalPrice;
      state.lastUpdated = new Date().toISOString();
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartData.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        const { totalItems, totalPrice } = updateCartTotals(state.cartData.items);
        state.cartData.totalItems = totalItems;
        state.cartData.totalPrice = totalPrice;
        state.lastUpdated = new Date().toISOString();
      }
    },
    clearCart: (state) => {
      state.cartData = null;
      state.status = 'idle';
      state.error = null;
      state.lastUpdated = null;
    },
    setCartItems: (state, action) => {
      state.cartData.items = action.payload;
      const { totalItems, totalPrice } = updateCartTotals(state.cartData.items);
      state.cartData.totalItems = totalItems;
      state.cartData.totalPrice = totalPrice;
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart API
      .addCase(addToCartAPI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.cartData = {
            items: Array.isArray(action.payload.items) ? action.payload.items : [],
            totalItems: Number(action.payload.totalItems) || 0,
            totalPrice: Number(action.payload.totalPrice) || 0
          };
        }
        state.status = 'succeeded';
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartData = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
        console.log("Cart state updated:", state.cartData); // Debug log
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("Cart fetch rejected:", action.payload); // Debug log
      })
      // Remove from Cart
      .addCase(removeFromCartAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartData = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Cart Item Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartData = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer; 