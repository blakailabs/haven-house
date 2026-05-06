"use server";

import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function submitReferral(formData: any) {
  try {
    const referralData = {
      ...formData,
      status: "pending",
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // If Firebase Admin is not configured, we'll log to console and return success
    // This allows the prototype to work even without full credentials
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.warn("Firebase Admin not configured. Simulating referral submission.");
      console.log("Data:", referralData);
      return { success: true, message: "Referral simulated successfully" };
    }

    const docRef = await adminDb.collection("referrals").add(referralData);
    
    return { 
      success: true, 
      referralId: docRef.id,
      message: "Referral submitted successfully" 
    };
  } catch (error: any) {
    console.error("Error submitting referral:", error);
    return { 
      success: false, 
      error: error.message || "Failed to submit referral" 
    };
  }
}
