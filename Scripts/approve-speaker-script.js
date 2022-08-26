const userList = document.getElementById("speakerRequests");

async function getPendingSpeakerRequests()
{
    // send a meeting ID and get a list of users back

    let requestString = `http://localhost:8080/speakers?status=pending`;

    const response = await fetch(requestString);

    let speakerList = await response.json();

    if (response.status === 200)
    {
        for(speaker of speakerList)
        {
            const row = document.createElement("tr");

            const userName = document.createElement("td");
            userName.innerText = speaker.userName;

            const name = document.createElement("td");
            name.innerText = `${speaker.fName} ${speaker.lName}`;

            const requestedMeeting = document.createElement("td");
            requestedMeeting.innerText = speaker.meetingSummary;

            const dropdownTD = document.createElement("td");
            const setStatus = document.createElement("input");
            setStatus.setAttribute("list", "requestOptions");
            setStatus.placeholder = "pending";
            setStatus.dataset.id = speaker.id;

            setStatus.addEventListener("change", async event =>
            {
                if (event.target.value === "pending")
                    return;
                updateStatus(setStatus.dataset.id, event.target.value);
            });
            dropdownTD.appendChild(setStatus);

            row.appendChild(userName);
            row.appendChild(name);
            row.appendChild(requestedMeeting);
            row.appendChild(dropdownTD);
            
            userList.appendChild(row);
        }

    }

}

getPendingSpeakerRequests();

async function updateStatus(id, newStatus)
{
    let requestString = `http://localhost:8080/speakers/${id}/${newStatus}`;

    const response = await fetch(requestString,
        {
            method: "PATCH"
        });

        if (response.status === 200)
        {
          //  alert("Request updated");
            location.reload();
        }
}