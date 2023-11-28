import React, { useEffect, useState } from "react";
import jwt_decode, { jwtDecode } from "jwt-decode";

function App() {
  const [events, setEvents] = useState([]);

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState(null);

  const handleCallbackResponse = async (response) => {
    console.log("Encoded JWT ID Token: " + response.credential);
    const userObject = jwtDecode(response.credential);
    console.log(userObject);
    console.log(userObject.email);
    const calendarId = userObject.email;

  const searchParams = new URLSearchParams(window.location.hash.substring(1)); // Exclude the leading '#'
  const accessToken = searchParams.get("access_token");

    if (accessToken) {
      console.log("Access Token:", accessToken);
      try {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=${accessToken}`);
        const data = await response.json();
        console.log("HI");
        console.log("PRINT SOMETHING DAMMIT!!!")
        console.log("THIS IS THE RESPONSE " , response);
        console.log("THIS IS THE DATA " , data);
        listUpcomingEvents(data.items); // Set the events state

      }
      catch (e) {
        console.log("ERROR");
        console.log(e);
      }


    setAccessToken(accessToken);
  } else {
    console.log("No Access Token");
  }

    /*
    const accessTokenRegex = /access_token=([^&]+)/;
    console.log("Access Token: " + accessTokenRegex)
    const match = window.location.hash.match(accessTokenRegex);
    console.log("Access Token: " + match)

    if (match && match[1]) {
      setAccessToken(match[1]);
    }
*/
//const searchParams = new URLSearchParams(window.location.search);
const authorizationCode = searchParams.get("code");
console.log("Authorization Code: " + authorizationCode);
    document.getElementById("signInDiv").hidden = true;
  };

  const handleSignOut = (event) => {
    setUser({});
    setAccessToken(null);
    document.getElementById("signInDiv").hidden = false;
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large", shape: "rectangular" }
    );
    google.accounts.id.prompt();
  }, []);
/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': '150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com',
                'redirect_uri': 'http://localhost:3000',
                'response_type': 'token',
                
                'scope': 'https://www.googleapis.com/auth/calendar', // Add the calendar scope here

                //'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

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
  form.submit();

}

/*
  return (
    <div className="App">
      <div id="signInDiv"></div>

      {accessToken && (
        <div>
          <p>Access Token: {accessToken}</p>
          <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
        </div>
      )}

      {user && (
        <div>
          <img src={user.picture} alt="User"></img>
          <h3>{user.name}</h3>
        </div>
        
      )}
      
            <button onClick={oauthSignIn}>Sign In with Google</button>

    </div>
  );
}
*/




const listUpcomingEvents = (eventsData) => {
  setEvents(eventsData);
};
return (
  <div className="App">
    {accessToken ? (
      <div>
        <p>Access Token: {accessToken}</p>
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
