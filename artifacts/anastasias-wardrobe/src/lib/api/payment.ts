import { apiClient } from "./client";
import {
  PaymentSessionPayload,
  PaymentSessionResponse,
  PaymentVerificationPayload,
} from "./types";

export class PaymentApiService {
  /**
   * Initialize a payment session on backend (e.g. create Razorpay order or Stripe payment intent)
   */
  public async createPaymentSession(
    payload: PaymentSessionPayload,
    mockFallback?: () => PaymentSessionResponse
  ): Promise<PaymentSessionResponse> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.post<PaymentSessionResponse>(
          "/payments/create-session/",
          payload
        );
      },
      () => {
        if (mockFallback) return mockFallback();
        return {
          sessionId: `sess_${Date.now()}`,
          orderId: payload.orderId,
          provider: payload.provider,
          amount: payload.amount,
          currency: payload.currency,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_anastasia",
          clientSecret: "pi_mock_secret_anastasia",
        };
      },
      `payments.createPaymentSession(${payload.provider})`
    );
  }

  /**
   * Verify digital signature and confirm transaction settlement with backend
   */
  public async verifyPayment(
    payload: PaymentVerificationPayload,
    mockFallback?: () => { success: boolean; transactionId: string }
  ): Promise<{ success: boolean; transactionId: string }> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.post<{ success: boolean; transactionId: string }>(
          "/payments/verify/",
          payload
        );
      },
      () => {
        if (mockFallback) return mockFallback();
        return {
          success: true,
          transactionId: `txn_${Date.now()}_verified`,
        };
      },
      `payments.verifyPayment(${payload.paymentId})`
    );
  }
}

export const paymentApi = new PaymentApiService();
