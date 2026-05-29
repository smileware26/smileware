function initAdminAccount() {
    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.find(
        user => user.email === "admin@gmail.com"
    );

    if (!adminExists) {
        users.push({
            email: "admin@gmail.com",
            password: "admin123",
            role: "admin"
        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    }
}

initAdminAccount();

function showError(message) {
    const error =
        document.getElementById("errorMsg");

    error.style.display = "block";
    error.innerText = message;
}

function clearError() {
    document.getElementById(
        "errorMsg"
    ).style.display = "none";
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}

function registerUser() {
    clearError();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (email === "" || password === "") {
        showError(
            "Please fill in email and password"
        );

        return;
    }

    if (!validEmail(email)) {
        showError("Enter a valid email address");

        return;
    }

    if (password.length < 6) {
        showError(
            "Password must be at least 6 characters"
        );

        return;
    }

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        showError("Account already exists");

        return;
    }

    users.push({
        email,
        password,
        role: "user"
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registration Successful!");
}

function loginUser() {
    clearError();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value
        .trim();

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (foundUser) {
        localStorage.setItem(
            "currentUser",
            email
        );

        window.location.href =
            foundUser.role === "admin"
                ? "admin.html"
                : "ui.html";
    } else {
        showError(
            "Invalid email or password"
        );
    }
}

function loginAdmin() {
    clearError();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (
        email === "admin@gmail.com" &&
        password === "admin123"
    ) {
        localStorage.setItem(
            "currentUser",
            email
        );

        window.location.href = "admin.html";
    } else {
        showError(
            "Invalid admin email or password"
        );
    }
}