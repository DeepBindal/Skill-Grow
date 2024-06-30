function saveUserToLocalStorage(user) {
    localStorage.setItem("adminUser", JSON.stringify(user));
    localStorage.setItem("isAdminAuthenticated", true);
  }
  
  //  function logoutUser() {
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("isAuthenticated");
  // }
  
  //  function getUserFromLocalStorage() {
  //   const user = localStorage.getItem("user");
  //   return user ? JSON.parse(user) : null;
  // }
  
  //  function isAuthenticated() {
  //   return localStorage.getItem("isAuthenticated") === "true";
  // }
  
  const form = document.querySelector(".account__form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
  
    if (!email) {
      alert("Please enter your email.");
      emailInput.focus();
      return;
    }
  
    if (!password) {
      alert("Please enter your password.");
      passwordInput.focus();
      return;
    }
  
    const payload = { email, password, role: "admin" };
    console.log(payload)
  
    const response = await fetch("https://skill-grow.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    if (res.message === "USERLOGGED") {
      saveUserToLocalStorage(res);
  
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (isAdminAuthenticated) {
      window.location.href = 'index.html';
    } else {
      console.log("User is not authenticated");
    }
  });
  
  window.onload = async function () {

    const response = await fetch("https://skill-grow.onrender.com/getGoogleToken")
    const res = await response.json()
  
      google.accounts.id.initialize({
        client_id: res, 
        callback: handleCredentialResponse,
      });
    
      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };
  
  async function handleCredentialResponse(googleResponse) {
    const idToken = googleResponse.credential;
    // console.log(idToken)
    const response = await fetch("https://skill-grow.onrender.com/auth/google", {
      method: "POST",
      headers: {
        // 'Authorization': `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken, role: "admin" }),
    });
    const res = await response.json();
    if (res.message === "User already exists" || res.message === "USERSIGNEDUP") {
      res.token = idToken;
      saveUserToLocalStorage(res);
  
      alert("Login successful!");
      window.location.href = "index.html";
    }
    console.log(res);
  }
  
  