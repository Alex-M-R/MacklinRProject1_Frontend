const complaintTable = document.getElementById("complaintTable");
    const complaintList = document.getElementById("complaintList");
    const meetingOptions = document.getElementById("MeetingOptionsList");

    const meetingMap = new Map();

    // const createMeetingButton = document.getElementById("createMeetingBtn")
    // const backToMainListBtn = document.getElementById("backToMainListBtn");
    // const meetingForm = document.getElementById("meetingForm");
    // const submitNewMeetingBtn = document.getElementById("submitBtn");
    // const specificMeetingTable = document.getElementById("specificMeetingTable");
    // const specificInfo = document.getElementById("specificInfo");


    // const basicInfo = document.getElementById("basicInfo");
    // const addInfo = document.getElementById("addInfo");
    // const sumInfo = document.getElementById("sumInfo");

    // submit meeting button here
    document.addEventListener("submit", async event => {
        event.preventDefault();
    });

    function clearTables() {
        complaintTable.innerText = "";
    }

    function showSpecific() {
        // show specific
        specificMeetingTable.setAttribute("style", "display: table");
        backToMainListBtn.setAttribute("style", "display:block");

        // Hide Rest
        createMeetingButton.setAttribute("style", "display: none;");
        meetingTable.setAttribute("style", "display: none");
    }

    function hideSpecific() {
        // hide specific
        specificMeetingTable.setAttribute("style", "display: none");
        backToMainListBtn.setAttribute("style", "display: none");

        // show default
        createMeetingButton.setAttribute("style", "display: block");
        meetingTable.setAttribute("style", "display: table");
    }

    function showForm() {
        // show form
        meetingForm.setAttribute("style", "display: block;");

        // Hide Rest
        createMeetingButton.setAttribute("style", "display: none;");
        meetingTable.setAttribute("style", "display: none");
    }

    function hideForm() {
        // hide form
        meetingForm.setAttribute("style", "display: none");

        // show rest
        createMeetingButton.setAttribute("style", "display: block");
        meetingTable.setAttribute("style", "display: table");
    }

    async function getAllComplaints() {
        let requestString = "http://localhost:8080/complaints";
        console.log(requestString);

        const response = await fetch(requestString);

        const complaints = await response.json();

        
        console.log(complaints);

        if (response.status === 200) {

            const meetings = await getAllMeetings();

            // meetingOptions.innerText = "";
            if (response.status === 200) {

                meetingMap.length = 0;
                
                for (meeting of meetings) {
                    if (meeting.id <= 0) { continue; }
                    //   console.log(meeting);
                    const optionElement = document.createElement("option");
                    const option = meeting.summary;
                    optionElement.value = meeting.summary;

                    meetingMap.set(meeting.summary, meeting.id);
                  //  meetingMap.push(`${meeting.summary}:${meeting.id}`);
                 //   optionElement.dataset.meetingID = meeting.id;

                    meetingOptions.appendChild(optionElement);
                }
            }

            for (complaint of complaints) {

                const complaintRow = document.createElement("tr");

                const description = document.createElement("td");
                description.innerText = complaint.description;

                const status = document.createElement("td");
                status.innerText = complaint.status;

                const btns = document.createElement("td");

                const aMeetingDate = document.createElement("td");
                let meeting = await getMeetingByID(complaint.meetingID);

                console.log(meeting);
                let meetingDate = epochDate = new Date(meeting.scheduledDate * 1000);

                aMeetingDate.innerText = epochDate.toLocaleString();

                const aMeetingAddress = document.createElement("td");
                aMeetingAddress.innerText = meeting.address;

                const meetingSummary = document.createElement("td");
                meetingSummary.innerText = meeting.summary;

                // create list input using our status list options
                const changeStatusTD = document.createElement("td");

                const setStatusInput = document.createElement("input");
                setStatusInput.setAttribute('list', 'StatusListOptions');
                setStatusInput.placeholder = complaint.status;
                setStatusInput.dataset.id = complaint.id;

                setStatusInput.addEventListener('change', async event => {
                    await patchComplaint(setStatusInput.dataset.id, event.target.value);
                });

                const changeMeetingTD = document.createElement("td");

                const setMeetingInput = document.createElement("input");
                setMeetingInput.setAttribute('list', 'MeetingOptionsList');
                setMeetingInput.placeholder = meeting.summary;

                setMeetingInput.dataset.id = complaint.id;
                setMeetingInput.addEventListener('change', async event => {
                    // set meeting
                    await setMeetingAssignment(setMeetingInput.dataset.id, event.target.value);

                });


                changeStatusTD.appendChild(setStatusInput);
                changeMeetingTD.appendChild(setMeetingInput);

                complaintRow.appendChild(description);
                // complaintRow.appendChild(status);

                complaintRow.appendChild(changeStatusTD);

                complaintRow.appendChild(aMeetingDate);
            
                // complaintRow.appendChild(meetingSummary);
                complaintRow.appendChild(changeMeetingTD);
                complaintRow.appendChild(aMeetingAddress);
                complaintList.appendChild(complaintRow);
            }
        }
        else {
            alert("Something went wrong");
        }
    }

    async function patchComplaint(id, newStatus) {
        let requestString = `http://localhost:8080/complaints/${id}/${newStatus}`;
        console.log(requestString);
        const response = await fetch(requestString,
            {
                method: "PATCH"
            });

        if (response.status === 200) {
            alert("status updated");
            location.reload();
        }
    }

    async function setMeetingAssignment(id, meetingSummary) {

        let meetingID = meetingMap.get(meetingSummary);
        
        // correct route now! just need to implement backend and then finish front end.
        let requestString = `http://localhost:8080/complaints/${id}/${meetingID}`;
        
        const response = await fetch(requestString,
            {
                method: "PUT"
            });

            if (response.status === 200)
            {
                alert("attached to meeting successfully");
                location.reload();
            }
    }

    
    async function getMeetingByID(id) {

        let requestString = `http://localhost:8080/meetings/${id}`;

        console.log(requestString);
        const response = await fetch(requestString);

        let meeting = await response.json();

        return meeting;
    }

    async function getAllMeetings() {

        let requestString = "http://localhost:8080/meetings";

        const response = await fetch(requestString);

        const meetings = await response.json();

        console.log(meetings);

        if (response.status === 200) {

            return meetings;
        }
    }


    // on first load
    // meetingForm.setAttribute("style", "display: none");
    //  specificMeetingTable.setAttribute("style", "display: none");
    // backToMainListBtn.setAttribute("style", "display: none");

    getAllComplaints();
