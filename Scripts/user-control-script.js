
const loginLink = document.getElementById("LoginLink");
const logoutLink = document.getElementById("LogoutLink");

const councilPortal = document.getElementById("CouncilPortal");



let user = localStorage.getItem("user");

CheckUser();

function CheckUser()
{
// no user then in logged out state
if (user === null) {
  loggedOut();
  return;
}

user = JSON.parse(user);

// not an activated account then go to logged out state
if (user.role === 'INACTIVE') {
  inactiveAccount();
  return;
}

// at least a constituent. 
loggedIn();
if (user.role === "COUNCIL") {
  loggedCouncil();
}
}



function loggedIn() {
  loginLink.setAttribute("style", "display: none");
  logoutLink.setAttribute("style", "display: inline");
}

function loggedOut() {
  localStorage.clear();

  loginLink.setAttribute("style", "display: inline");
  logoutLink.setAttribute("style", "display: none");
  councilPortal.setAttribute("style", "display: none");
}

function inactiveAccount()
{
  // be logged in, but can't access active account features
}

function loggedCouncil() {
  councilPortal.setAttribute("style", "display: inline");
}