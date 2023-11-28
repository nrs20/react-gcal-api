import React, { useEffect, useState } from "react";
import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com",
  apiKey: "AIzaSyCNO3lDcnwqpqwYC1e5xcvlMbAaVGM2VzY",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};
const calendarId = "nrs5@njit.edu";

const apiCalendar = new ApiCalendar(config);

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handleLoadCalendarApi = async () => {
      try {
        await apiCalendar.handleClientLoad();
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=ya29.a0AfB_byC_FzI-qAwabN1sGEn9g_Kj6D2oMUGW-61dg0HKh_UpFmbddG9evIGkf8ZBE6coifBt2HCnfJUyflFQkcCVRsGoEQFoBqvFFInqBGdzhqebtgu7UBElnhO1i1fN_YwigXJCaG_6KurMLVvSlf6BgHuziL5GuKrFMAaCgYKAeYSARISFQHGX2Mi7r0azgV8mj3YTFYSVoERTA0173`);
        const data = await response.json();
        console.log("Response from Google Calendar API:", data);
        if (apiCalendar.sign) {
          listUpcomingEvents(data.items);
        }
      } catch (error) {
        console.error("Error loading Google Calendar API:", error);
      }
    };

    handleLoadCalendarApi();
  }, []);

  const listUpcomingEvents = (eventsData) => {
    setEvents(eventsData);
  };

  return (
    <div>
      <h1>Google Calendar API Example</h1>
      <ul>
      {events.map((event) => (
  <li key={event.id}>
    <strong>{event.summary}</strong>
    {event.start && event.start.dateTime && (
      <p>Start Time: {event.start.dateTime}</p>
    )}
    {event.description && <p>Description: {event.description}</p>}
  </li>
))}

      </ul>
    </div>
  );
}

export default App;
