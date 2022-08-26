const userBody = document.getElementById("inactiveUserList");

// get all inactive users

// display users in list with dropdown 
getInactiveUsers();

async function getInactiveUsers() {
    let requestString = `http://localhost:8080/users?role=inactive`;

    const response = await fetch(requestString);

    const users = await response.json();

    console.log(users);

    if (response.status === 200) {

        for (let user of users) {
            const userRow = document.createElement("tr");

            const userNameDisplay = document.createElement("td");
            userNameDisplay.innerText = user.username;

            const fullName = document.createElement("td");
            fullName.innerText = `${user.fName} ${user.lName}`;

            const setRoleInput = document.createElement("input");
            setRoleInput.setAttribute('list', 'UserListOptions');
            setRoleInput.dataset.id = user.id;

            // shows default value inactive when not currently clicking dropdown
            setRoleInput.placeholder = "inactive";

            setRoleInput.addEventListener('change', async event => {
                await setUserRole(setRoleInput.dataset.id, event.target.value);
            });
            const inputTD = document.createElement("td");

            inputTD.appendChild(setRoleInput);

            userRow.appendChild(userNameDisplay);
            userRow.appendChild(fullName);
            userRow.appendChild(inputTD);

            userBody.appendChild(userRow);
        }
    }
}

async function setUserRole(id, newRole) 
{
    if (newRole === "inactive")
    return;

    let requestString = `http://localhost:8080/users/${id}/${newRole}`;

    const response = await fetch(requestString,
        {
            method: "PATCH"
        });

        if (response.status === 200)
        {
            alert("user role updated");
            location.reload();
        }

}