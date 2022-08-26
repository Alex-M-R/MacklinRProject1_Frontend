const descriptionBox = document.getElementById("description");

    document.addEventListener("submit", async event =>
    {
        event.preventDefault();

        const description = descriptionBox.value;

        // id will be clobbered with db key. meetingID defaulting to -1. Council member will assign complaint a valid meetingID if not ignoring request
      //  const complaint = {id:0, description, status:'PENDING', meetingID: -1};
        const complaint = {description}

        const response = await fetch("http://localhost:8080/complaints",
        {
            method:"POST",
            body: JSON.stringify(complaint),
            headers:
            {
                "Content-Type":"application/json"
            }
        });

        if (response.status === 201)
        {
            // ok
            alert("Complaint submitted");
            window.location = "main-page.html";
            // later send user to a "Thank you" page that links back to the main site, rather than keep them on the complaint submission form.
        }
        else
        {
            alert("Something went wrong");
        }

    });