

function saveUserToLocalStorage(user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", true);
  }

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.querySelector(".account__form");
    
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const payload = {
            firstName,
            lastName,
            email,
            password,
            isGoogle: false,
            role: "admin"
        };

        console.log(payload)

        try {
            const response = await fetch("https://skill-grow.onrender.com/auth/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const res = await response.json()
            console.log(res);
            if (res.message === "USERSIGNEDUP") {
                alert("Sign-up successful!");
                signUpForm.reset();
                window.location.href = "login.html";
            } else {
                alert(res.message || "Sign-up failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
            console.error("Sign-up error:", error);
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

});

async function checkAuthAndRedirect() {
    const token = localStorage.getItem('isAuthenticated');
    console.log(token, "token is")

    if(token){
        window.location.href = 'index.html';
        return;
    }
}

document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);

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
      body: JSON.stringify({ token: idToken }),
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
  
  