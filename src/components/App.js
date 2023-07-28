// import logo from './logo.svg';
// import React, { useState } from 'react';

// import VoiceRecorder from './VoiceRecorder';
// import Piano from './components/Piano/Piano';

// import './App.css';



// //npm install recorder-js @react-icons/all-files react-icons

// function App() {
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   console.log('Recorded Blob from App:', recordedBlob);

//   return (
//     <div className="App">
      
//         <VoiceRecorder setRecordedBlob={setRecordedBlob} /><br></br>
//         <Piano recordedBlob={recordedBlob}/>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import VoiceSampler from './VoiceSampler/VoiceSampler';
import './App.css';

function App() {
  return (
    <div className="App">
      <VoiceSampler />
    </div>
  );
}

export default App;
