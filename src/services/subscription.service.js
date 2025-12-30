import api from "./api";

export const SubscriptionService = {

  /**
   * Mengambil daftar paket langganan (Pricing List)
   */
  async getListTransaction() {
    const response = await api.get('/v1/subscription/transactions');
    return response.data;
  },


};