// const BASE_URL = "http://localhost:3000/auth";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Invalid response from server. Status: ${res.status}`);
  }

  if (!res.ok) {
    // Check if the response is not OK and display the error message
    throw new Error(data.error || `HTTP error! Status: ${res.status}`);
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
    return JSON.parse(atob(data.token.split(".")[1])).payload;
  }

  throw new Error("Invalid response from server");
};

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return await handleResponse(res);
  } catch (error) {
    console.log(error);
  
    throw new Error(error.message);
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return await handleResponse(res);
  } catch (error) {
    console.log(error);
   
    throw new Error(error.message);
  }
};

export { signUp, signIn };
