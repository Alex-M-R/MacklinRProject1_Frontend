const fNameInput = document.getElementById("inputFName");
const lNameInput = document.getElementById("inputLName");
const userNameInput = document.getElementById("inputUserName");
const passwordInput = document.getElementById("inputPassword");

document.addEventListener("submit", async event =>
{
    event.preventDefault();

    if (fNameInput.value === "")
    {
        alert("First name cannot be blank");
        return;
    }

    if (lNameInput.value === "")
    {
        alert("Last name cannot be blank");
        return;
    }

    if (userNameInput.value === "")
    {
        alert("Username cannot be blank");
        return;
    }

    if (passwordInput.value === "")
    {
        alert("Password cannot be blank");
        return;
    }

    // Not finished since new users need to be approved. So figure that out before finishing this I guess
    let fName = fNameInput.value;
    let lName = lNameInput.value;
    let username = userNameInput.value;
    let password = passwordInput.value;
    let credentials = {fName, lName, username, password, role: 'INACTIVE'};

    console.log(credentials);

    const httpResponse = await fetch("http://localhost:8080/users",
    {
        method: "POST",
        body: JSON.stringify(credentials),
        headers:
        {
            'Content-Type': "application/json"
        }
    });

    if (httpResponse.status === 201)
    {
        alert("Account registered. A council member will review your account request within 5-7 business days.");
        window.location = "main-page.html";
    }
    else
    {
        let error = httpResponse.body;
        alert("An error has occured. Please try again later: " + error);
    }

});