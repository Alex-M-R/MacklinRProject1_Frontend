const usernameInput = document.getElementById("inputUserName");
    const passwordInput = document.getElementById("inputPassword");

    document.addEventListener("submit", async event => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;
        const credentials = { username, password };

        const httpResponse = await fetch("http://localhost:8080/login",
            {
                method: "POST",
                body: JSON.stringify(credentials),
                headers:
                {
                    'Content-Type': "application/json"
                }
            });

        if (httpResponse.status === 200) {
            const user = await httpResponse.json();
            alert("login successful");
         
            // local storage can be used to cache information
            user.password = null;
            localStorage.setItem("user", JSON.stringify(user));

            // localStorage.getItem("user") // get item
            // localStorage.clear();    // clear local storage

            // local storage is tied by domain name

            window.location = "main-page.html";

        }

        if (httpResponse.status === 404)
        {
            alert("username not found");
        }

        if (httpResponse.status === 400)
        {
            alert("password does not match");
        }


    });