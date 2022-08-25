const userNameInput = document.getElementById("inputUserName");
const passwordInput = document.getElementById("inputPassword");

document.addEventListener("submit", async event =>
{
    event.preventDefault();

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
    let username = userNameInput.value;
    let password = passwordInput.value;
    let credentials = {username, password, role: 'INACTIVE'};

   // return; // early return to skip the below request mockup

    // current thought(s):
    // - change app-user role to include 'INACTIVE' to represent an account that has been created, but not approved by a council member.
    // - council members can "approve" an account, by setting role to 'CONSTITUENT', or 'COUNCIL'.
    // - council members can deny approval by deleting the account (if this is bad... then either leave forever inactive, or add state 'DENIED')


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
    }
    else
    {
        alert("An error has occured. Please try again later.");
    }

});