import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_EZRentDummyKeyId';
export const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'ezrent_dummy_razorpay_secret_key';
export const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'ezrent_webhook_secret';

export const getRazorpayInstance = (): Razorpay => {
  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
};
