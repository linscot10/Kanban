document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value.trim()
    const password = document.getElementById("password").value

    // validation

    if (username === "" || password === "") {
        alert("both fields are required!!")
        return;
    }

    if (password.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    const user = {
        username,
        loginTime: new Date().toISOString()
    }

    localStorage.setItem("taskManagerUser", JSON.stringify(user))

    window.location.href = 'dashoard.html'
})