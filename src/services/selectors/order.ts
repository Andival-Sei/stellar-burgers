import { RootState } from '../store';

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderError = (state: RootState) => state.order.lastError;
