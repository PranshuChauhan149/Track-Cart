import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGrocery {
  _id?: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ICartSlice {
  cartData: IGrocery[];
}

const initialState: ICartSlice = {
  cartData: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      const existing = state.cartData.find(
        (item) => item._id === action.payload._id
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartData.push(action.payload);
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.cartData.findIndex(
        (i) => i._id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.cartData[itemIndex].quantity > 1) {
          state.cartData[itemIndex].quantity -= 1;
        } else {
          state.cartData.splice(itemIndex, 1); // remove if quantity becomes 0
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
