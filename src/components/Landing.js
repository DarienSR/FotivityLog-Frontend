import { Link } from 'react-router-dom'
import "../App.css"
const Landing = () => {
  return (
    <div className="fotivity-container">
      <h3 style={{ textAlign: 'center'}}>FotivityLog allows you to track your sessions for work, study, or any other activity. Giving you various visual graphs that breakdown the amount of time spent, quality of your session, location, etc.</h3>
      <div style={{display: "flex", justifyContent: 'center'}}>
        <img src="./landing/heatmap.png" alt="heatmap of sessions"/>
        <img src="./landing/breakdown.png" alt="breakdown of sessions"/>
      </div>
      <div style={{display: "flex", justifyContent: 'center'}}>
        <img src="./landing/sessions.png" alt="showcasing sessions"/>
      </div>

      <h3 style={{ textAlign: 'center'}}>This is a personal project of mine and is currently under development. Here are some of the features I plan on adding to the application:</h3>
      <div style={{width: "30%", margin: "0 auto"}}>
        <ul>
          <li>Overhaul / redesign the entire site. The design of the site is very much temporary. I'm currently focusing on functionality and implementing features</li>
          <li>More graphs that give further analysis on your sessions</li>
          <li>Ability to add tags to your sessions to further differentiate activities (ex. Study, Fitness, Reading) which will then be sub-divided by topics.</li>
          <li>Organizer to keep track of tasks, allow streaks, keep notes, etc. This will be automatically integrated with the dashboard/sessions</li>
        </ul>
      </div>
      <h3 style={{ textAlign: 'center'}}>If you have any questions about this application, suggestions for improvement, or just want to get in contact. Feel free to reach out to me personally (if you know me) or email me at: fotivitylog@gmail.com </h3>
    </div>
  )
}

export default Landing