let getMinutes = function(start, end) { return Math.floor(((Math.abs(start  - end)) / 1000) / 60); } // hours

export function ProcessSessionData(data) {
  // create our session object, this will hold all the data that is used in the dashboards.
  // each i index of each value represents the ith object.
  // ex. topics[1] and locations[1] belong to the same session


  const { ids } = data;
  
  let dataArr = [];
  ids.forEach((id) => {
    dataArr.push(data.entities[id])
  })



  let sessions = {
    topics: [],
    locations: [],
    times: [],
    totalMinutes: 0,
    topicByMinutes: {},
    locationByMinutes: {},
    todaysHours: 0
  };

  // loop through each session and start aggregating their information
  let totalMinutes = 0;
  let topicByMinutes = {};
  let locationByMinutes = {};

  dataArr.forEach((session) => {
    if(session?.end_time === null) return; // do not do any processing for on-going sessions
    sessions.topics.push(session.topic.toUpperCase());
    sessions.locations.push(session.location.toUpperCase());
    let sessionLength = DetermineSessionLength(session, sessions);
    totalMinutes += sessionLength
    topicByMinutes[session.topic] = (topicByMinutes[session.topic] || 0) + sessionLength;
    locationByMinutes[session.location] = (locationByMinutes[session.location] || 0) + sessionLength;
  })
  sessions.totalMinutes = totalMinutes;
  sessions.topicByMinutes = topicByMinutes;
  sessions.locationByMinutes = locationByMinutes;

  return sessions;
}

// Helper function
function DetermineSessionLength(session, sessions) {
  let start = new Date(session.start_time);
  let end = new Date(session.end_time);

  let totalMinutes = 0;
  // determine if the session spans multiple days
  if(!(start.getDay() === end.getDay())) {
    let midnight = new Date(end.setHours(0, 0, 0, 0))
    // find difference between start and midnight. 
    let differenceStart = getMinutes(new Date(session.start_time), new Date(midnight));
    sessions.times.push({
      date: (session.start_time.split('T')[0]).split(' ')[0],
      difference: differenceStart
    });
    let differenceEnd = getMinutes(new Date(midnight), new Date(session.end_time))
    // find difference between midnight and end
    sessions.times.push({
      date: (session.end_time.split('T')[0]).split(' ')[0],
      difference: differenceEnd
    });
    totalMinutes += differenceStart;
    totalMinutes += differenceEnd;
  } else {
    // sessions contained all in the same day
    let difference = getMinutes(new Date(session.start_time), new Date(session.end_time));
    sessions.times.push({
      date: (session.start_time.split('T')[0]).split(' ')[0],
      difference: difference
    });
    totalMinutes += difference;
  }
  return totalMinutes 
}

export function GroupSameDayDifferences(data) {
  let sessions = {};
  // create a frequency count of the dates and their times.
  // if we have an existing date, just add the additional study session time
  data.forEach((session) => {
    sessions[session.date] = (sessions[session.date] || 0) + session.difference
  })
  // we are then reformatting the above
  let days = [];
  for(const property in sessions) {
    days.push({date: property, difference: sessions[property]})
  }
  return days;
}