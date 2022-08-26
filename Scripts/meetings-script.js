const meetingTable = document.getElementById("meetingTable");
const description = document.getElementById("meetingList");

const createMeetingBtn = document.getElementById("createMeetingBtn")
const backToMainListBtn = document.getElementById("backToMainListBtn");
const requestSpeakBtn = document.getElementById("requestSpeakBtn");

const meetingForm = document.getElementById("meetingForm");
const submitNewMeetingBtn = document.getElementById("submitBtn");
const specificMeetingTable = document.getElementById("specificMeetingTable");
const specificInfo = document.getElementById("specificInfo");


const basicInfo = document.getElementById("basicInfo");
const addInfo = document.getElementById("addInfo");
const sumInfo = document.getElementById("sumInfo");


// submit meeting button here
document.addEventListener("submit", async event => {
    event.preventDefault();
});

requestSpeakBtn.addEventListener("click", async event => {
    requestToSpeak(requestSpeakBtn.dataset.meetingID);
});


let storedUser = localStorage.getItem("user");

createMeetingBtn.setAttribute("style", "display: none");
requestSpeakBtn.setAttribute("style", "display: none");
if (storedUser !== null) {
    storedUser = JSON.parse(storedUser);
    if (storedUser.role === "COUNCIL") {
        createMeetingBtn.setAttribute("style", "display: block");
    }
}


async function createMeetingButton() {
    // create meeting
    await createMeeting();

    hideForm();

    // refresh meeting display
    clearTables();
    getAllMeetings();
}

function clearTables() {
    description.innerText = "";
    specificInfo.innerText = "";
}

function showSpecific() {
    // show specific
    specificMeetingTable.setAttribute("style", "display: table");
    backToMainListBtn.setAttribute("style", "display:block");

    if (storedUser !== null && storedUser.role !== "INACTIVE") {
        requestSpeakBtn.setAttribute("style", "display: block");
    }

    // Hide Rest
    createMeetingBtn.setAttribute("style", "display: none;");
    meetingTable.setAttribute("style", "display: none");
}

function hideSpecific() {
    // hide specific
    specificMeetingTable.setAttribute("style", "display: none");
    backToMainListBtn.setAttribute("style", "display: none");
    requestSpeakBtn.setAttribute("style", "display: none");

    // show default
    createMeetingBtn.setAttribute("style", "display: block");
    meetingTable.setAttribute("style", "display: table");
}

function showForm() {
    // show form
    meetingForm.setAttribute("style", "display: block;");

    // Hide Rest
    createMeetingBtn.setAttribute("style", "display: none;");
    meetingTable.setAttribute("style", "display: none");
}

function hideForm() {
    // hide form
    meetingForm.setAttribute("style", "display: none");

    // show rest
    createMeetingBtn.setAttribute("style", "display: block");
    meetingTable.setAttribute("style", "display: table");
}

async function createMeeting() {
    const dateInput = document.getElementById("dateInput");
    const addressInput = document.getElementById("addressInput");
    const summaryInput = document.getElementById("summaryInput");

    let myDate = new Date(dateInput.value);
    console.log("my date " + myDate);
    let epochDate = myDate.getTime() / 1000.0;
    console.log("Epoch date: " + epochDate);
    const newMeeting = { scheduledDate: epochDate, address: addressInput.value, summary: summaryInput.value };
    const response = await fetch("http://localhost:8080/meetings",
        {
            method: "POST",
            body: JSON.stringify(newMeeting),
            headers:
            {
                "Content-Type": "application/json"
            }
        });

    if (response.status === 201) {
        // ok
        alert("Meeting submitted");
        // later send user to a "Thank you" page that links back to the main site, rather than keep them on the complaint submission form.
    }
    else {
        alert("Something went wrong");
    }
}

async function getAllMeetings() {

    let requestString = "http://localhost:8080/meetings";

    const response = await fetch(requestString);

    const meetings = await response.json();

    console.log(meetings);

    if (response.status === 200) {
        for (meeting of meetings) {

            if (meeting.id <= 0)
                continue;
            console.log(meeting.address);

            const meetingRow = document.createElement("tr");

            const date = document.createElement("td");
            epochDate = new Date(meeting.scheduledDate * 1000);
            date.innerText = epochDate.toLocaleString();

            const address = document.createElement("td");
            address.innerText = meeting.address;

            // const summary = document.createElement('td');
            // summary.innerText = meeting.summary;

            const button = document.createElement('button');

            button.dataset.meetingID = meeting.id;  // .dataset lets you get/set properties on the button.
            button.innerText = "View";              // text on the button
            button.addEventListener('click', async buttonClicked => {

                await viewMeeting(buttonClicked.target.dataset.meetingID);
            });

            meetingRow.appendChild(address);
            meetingRow.appendChild(date);
            // meetingRow.appendChild(summary);
            meetingRow.appendChild(button);

            description.appendChild(meetingRow);
        }
    }
    else {
        alert("Something went wrong");
    }
}

async function viewMeeting(meetingID) {
    console.log("viewing meeting " + meetingID);


    let requestString = `http://localhost:8080/meetings/`;

    requestString += meetingID;

    console.log(requestString);
    const response = await fetch(requestString);

    const meeting = await response.json();

    console.log(meeting);


    if (response.status === 200) {

        epochDate = new Date(meeting.scheduledDate * 1000);
        // schedInfo.innerText = epochDate.toLocaleString();
        const row = document.createElement("tr");

        const basic = document.createElement("td");
        const complaints = document.createElement("td");
        const speakers = document.createElement("td");

        basic.innerText = `Where:\n${meeting.address}\n\nWhen:\n ${epochDate.toLocaleString()}\n\nSummary\n ${meeting.summary}`;

        // attached complaints
        let complaintList = await getComplaintsByMeeting(meetingID);

        clearTables();
        let cString = "";
        for (item of complaintList) {
            cString += `${item.description}\n\n`;
        }

        complaints.innerText = cString;


        // approved speakers
        let speakerList = await getSpeakersByMeeting(meetingID);

        let alreadyRequested = false;

        let sString = "";
        console.log(speakerList);
        for (item of speakerList) 
        {
            
            if (item.state === "APPROVED") {
                sString += `${item.fName} ${item.lName}\n`;   // get combo of first and last name
            }
            if (storedUser === null)
                continue;
            if (item.appUserID === storedUser.id) {
                // hide request to speak button. Current user already speaking
                alreadyRequested = true;
            }
        }

        speakers.innerText = sString;

        row.appendChild(basic);
        row.appendChild(complaints);
        row.appendChild(speakers);

        specificInfo.appendChild(row);

        showSpecific();

        requestSpeakBtn.dataset.meetingID = meetingID;
        // hide request button if already speaking     
        if (alreadyRequested) {
            requestSpeakBtn.setAttribute("style", "display: none");
        }
    }
    else {
        alert("Something went wrong");
    }
}

async function getComplaintsByMeeting(id) {

    console.log("viewing meeting " + id);

    let requestString = `http://localhost:8080/complaints?meetingID=${id}`;

    console.log(requestString);
    const response = await fetch(requestString);

    let complaintList = await response.json();

    return complaintList;
}

async function getSpeakersByMeeting(meetingID) {
    // send a meeting ID and get a list of users back
    console.log("get Speakers by Meeting ID: " + meetingID);

    let requestString = `http://localhost:8080/speakers/${meetingID}`;

    const response = await fetch(requestString);

    let speakerList = await response.json();

    return speakerList;
}

async function requestToSpeak(meetingID) {
    console.log("Request speak button pressed");
    // assuming button only shows when a valid user, and not already speaking.. so just being lazy and sending request without checking. lel
    let request = `http://localhost:8080/speakers/${meetingID}/${storedUser.id}`;

    console.log(request);
    const response = await fetch(request,
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            }
        });

    if (response.status === 201) {
        alert("Request received. The council will review your request in the next 48 hours.");
        location.reload();
    }
}

// on first load
meetingForm.setAttribute("style", "display: none");
specificMeetingTable.setAttribute("style", "display: none");
backToMainListBtn.setAttribute("style", "display: none");

getAllMeetings();