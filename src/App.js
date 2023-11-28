import React, { useEffect, useState, useRef } from "react";
import jwt_decode, { jwtDecode } from "jwt-decode";

function App() {
  const [events, setEvents] = useState([]);

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState(null);
  //const [oauthCalled, setOauthCalled] = useState(false); // Initialize with false
  const [oauthCalled, setOauthCalled] = useState(() => {
    // Initialize from localStorage or default to false
    return JSON.parse(localStorage.getItem("oauthCalled")) || false;
  });


  const handleSignOut = (event) => {
    setUser({});
    setAccessToken(null);
    setOauthCalled(false); // Reset to false when signing out

    document.getElementById("signInDiv").hidden = false;
  };



const handleCallbackResponse = async (response) => {
  console.log("User's email:", response.email);
  const calendarId = response.email;

  // ... rest of your code
};
  //instead of signing in multiple times, just sign in once and then use the access token to get the calendar events
  useEffect(() => {
    const fetchData = async () => {
      if (oauthCalled) {
        const searchParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = searchParams.get("access_token");
  
        if (accessToken) {
          try {
            // Fetch user's email from the UserInfo endpoint
            const emailSite = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;
            const emailFetch = await fetch(emailSite);
            const emailData = await emailFetch.json();
            const userEmail = emailData.email;
  
            // Log and store the email
            console.log("User's email:", userEmail);
  
            // Make the Google Calendar API request
            const calendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${userEmail}/events?access_token=${accessToken}`;
            const response = await fetch(calendarApiUrl);
            const data = await response.json();
  
            // Log and process the Google Calendar API response
            console.log("Google Calendar API Response:", data);
            listUpcomingEvents(data.items); // Set the events state
            handleCallbackResponse({ email: userEmail });
  
          } catch (e) {
            console.log("Error:", e);
          }
          setAccessToken(accessToken);
          // Do whatever you want with the access token here
        } else {
          console.log("NO ACCESS TOKEN");
        }
      }
    };
  
    fetchData();
  }, [oauthCalled]);

  const saveOauthCalledToStorage = (value) => {
    setOauthCalled(value);
    localStorage.setItem("oauthCalled", JSON.stringify(value));
  };
  /*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  //setOauthCalled(true); // Update the state to true
  saveOauthCalledToStorage(true);

  if(oauthCalled){
    console.log("OAUTH CALLED IN OAUTH SIGN IN");

    
  }
  else{
    console.log("OAUTH NOT CALLED IN OAUTH SIGN IN");
  }
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    'client_id': '150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com',
    'redirect_uri': 'http://localhost:3000',
    'response_type': 'token',
    'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
    'include_granted_scopes': 'true',
    'state': 'pass-through value'
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
 // console.log("DONE");

  form.submit();
}






const listUpcomingEvents = (eventsData) => {
  console.log("Setting events:", eventsData);
  setEvents(eventsData);
};
return (
  <div className="App">
    {accessToken ? (
      <div>
                <button onClick={handleSignOut}>Sign Out</button>
        <h1>Google Calendar API Example</h1>
        <ul>
         
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.summary}</strong>
              {event.start && event.start.dateTime && (
                <p>Start Time: {event.start.dateTime}</p>
              )}
              {event.description && (
                <p>Description: {event.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <div id="signInDiv"></div>
        <button onClick={oauthSignIn}>Sign In with Google</button>
      </div>
    )}
  </div>
);
}
export default App;