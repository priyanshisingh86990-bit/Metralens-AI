const API_BASE_URL = "http://localhost:5000/api";

// LOGIN
export const loginUser = async ({
  name,
  inspectorId,
  role,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        inspectorId,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
};


// SIGNUP
export const signupUser = async ({
  name,
  email,
  inspectorId,
  password,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        inspectorId,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Signup failed"
    );
  }

  return data;
};


// CREATE INSPECTION
export const createInspection = async ({
  inspectorId,
  productName,
  brand,
  category,
  manufacturer,
  batchNumber,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/inspections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inspectorId,
        productName,
        brand,
        category,
        manufacturer,
        batchNumber,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create inspection"
    );
  }

  return data;
};