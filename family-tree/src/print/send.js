import { authService, familyService } from "family-tree/src/services/api.js";

const API_URL = "http://localhost:3500/api";

// Email sending implementation
const EmailSender = async (Data, token) => {
  try {
    const response = await fetch(`${API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(Data),
    });
    const result = await response.json();
    switch (true) {
      case !response.ok:
        throw new Error(result.message || "Failed to send");
      default:
        return result;
    }
  } catch (error) {
    //throw error message
    console.error("Error", error.message);
    throw error;
  }
};
