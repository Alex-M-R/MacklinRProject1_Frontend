const meetingTable = document.getElementById("meetingTable");
const description = document.getElementById("meetingList");

const createMeetingButton = document.getElementById("createMeetingBtn")
const backToMainListBtn = document.getElementById("backToMainListBtn");
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


async function CreateMeetingButton() {
    // create meeting
    await CreateMeeting();

    HideForm();

    // refresh meeting display
    ClearTables();
    GetAllMeetings();
}

function ClearTables() {
    description.innerText = "";
    specificInfo.innerText = "";
}

function ShowSpecific() {
    // show specific
    specificMeetingTable.setAttribute("style", "display: table");
    backToMainListBtn.setAttribute("style", "display:block");

    // Hide Rest
    createMeetingButton.setAttribute("style", "display: none;");
    meetingTable.setAttribute("style", "display: none");
}

function HideSpecific() {
    // hide specific
    specificMeetingTable.setAttribute("style", "display: none");
    backToMainListBtn.setAttribute("style", "display: none");

    // show default
    createMeetingButton.setAttribute("style", "display: block");
    meetingTable.setAttribute("style", "display: table");
}

function ShowForm() {
    // show form
    meetingForm.setAttribute("style", "display: block;");

    // Hide Rest
    createMeetingButton.setAttribute("style", "display: none;");
    meetingTable.setAttribute("style", "display: none");
}

function HideForm() {
    // hide form
    meetingForm.setAttribute("style", "display: none");

    // show rest
    createMeetingButton.setAttribute("style", "display: block");
    meetingTable.setAttribute("style", "display: table");
}

async function CreateMeeting() {
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

async function GetAllMeetings() {

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

                await ViewMeeting(buttonClicked.target.dataset.meetingID);

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

async function ViewMeeting(meetingID) {
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

        let complaintList = await GetComplaintsByMeeting(meetingID);

        ClearTables();
        let cString = "";
        for (item of complaintList) {
            cString += `${item.description}\n\n`;
        }

        complaints.innerText = cString;
        speakers.innerText = "<Under Construction>";

        row.appendChild(basic);
        row.appendChild(complaints);
        row.appendChild(speakers);

        specificInfo.appendChild(row);

        //  basicInfo.innerText = `Where:\n${meeting.address}\n\nWhen:\n ${epochDate.toLocaleString()}\n\nSummary\n ${meeting.summary}`;

        // addInfo.innerText = meeting.address;

        //  sumInfo.innerText = meeting.summary;            
    }
    else {
        alert("Something went wrong");
    }

    ShowSpecific();


}

async function GetComplaintsByMeeting(id) {

    console.log("viewing meeting " + id);

    let requestString = `http://localhost:8080/complaints?meetingID=${id}`;

    console.log(requestString);
    const response = await fetch(requestString);

    let complaintList = await response.json();

    return complaintList;
}

// on first load
meetingForm.setAttribute("style", "display: none");
specificMeetingTable.setAttribute("style", "display: none");
backToMainListBtn.setAttribute("style", "display: none");

GetAllMeetings();