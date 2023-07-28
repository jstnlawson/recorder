// import './Piano.css'
// import Key from '../Key/Key.js'
// import React, { useState, useEffect } from 'react';

// const ctx = new (window.AudioContext || window.webkitAudioContext)();

// function Note(frequency, detune) {
//     this.note = ctx.createOscillator();
//     this.note.frequency.value = frequency
//     this.note.detune.value = detune
// }

// const Piano = ({ recordedBlob }) => {
//     const [activeKey, setActiveKey] = useState({})

//     const handleKeyDown = (event) => {

//         if (event.key === 65) {

//             if (!activeKey['a']) {
//                 const key1 = new Note(440, 0);
//                 key1.note.start(0);
//                 setActiveKey((prevState) => ({ ...prevState, a: key1 }));
//             }
//         } else if (event.key === 83) {
//             if (!activeKey['s']) {
//                 const key2 = new Note(440, 275);
//                 key2.note.start(0);
//                 setActiveKey((prevState) => ({ ...prevState, s: key2 }));
//                 playRecordedSound();
//             }
//         }
//     };

//     const handleKeyUp = (event) => {
//         if (event.key === 65 && activeKey['a']) {
//             activeKey['a'].note.stop(0);
//             setActiveKey((prevState) => ({ ...prevState, a: null }));
//         } else if (event.key === 83 && activeKey['s']) {
//             activeKey['s'].note.stop(0);
//             setActiveKey((prevState) => ({ ...prevState, s: null }));
//         }
//     };

//     // Function to play the recorded sound
//     const playRecordedSound = () => {
//         console.log('recorded blob:', recordedBlob)
//         if (recordedBlob) {
//           const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//           audioContext.decodeAudioData(recordedBlob, (buffer) => {
//             const source = audioContext.createBufferSource();
//             source.buffer = buffer;
//             source.connect(audioContext.destination);
//             source.start(0);
//           });
//         }
//       };
      

//     useEffect(() => {
//         console.log('Recorded Blob in Piano:', recordedBlob);
   
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);

//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//         };
//     }, [activeKey, recordedBlob]);

//     return (
//         <div className='piano'>
//             <Key label="a" keyCode={65} onClick={handleKeyDown} />
//             <Key label="s" keyCode={83} onClick={handleKeyDown} />
//         </div>
//     )
// }

// export default Piano

import React, { useState, useEffect } from 'react';
import './Piano.css';
import Key from '../Key/Key.js';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

function Note(frequency, detune) {
  this.note = ctx.createOscillator();
  this.note.frequency.value = frequency;
  this.note.detune.value = detune;
}

const Piano = ({ recordedBlob }) => {
  const [activeKey, setActiveKey] = useState({});
  const [detuneValue, setDetuneValue] = useState(0);

  const handleKeyDown = (event) => {
    if (event.key === 'a') {
      if (!activeKey['a']) {
        const key1 = new Note(440, 0);
        key1.note.start(0);
        setActiveKey((prevState) => ({ ...prevState, a: key1 }));
      }
    } else if (event.key === 's') {
      if (!activeKey['s']) {
        const key2 = new Note(440, detuneValue); // Use detuneValue for detuning
        key2.note.start(0);
        setActiveKey((prevState) => ({ ...prevState, s: key2 }));
        playRecordedSound();
      }
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'a' && activeKey['a']) {
      activeKey['a'].note.stop(0);
      setActiveKey((prevState) => ({ ...prevState, a: null }));
    } else if (event.key === 's' && activeKey['s']) {
      activeKey['s'].note.stop(0);
      setActiveKey((prevState) => ({ ...prevState, s: null }));
    }
  };

  // Function to play the recorded sound
  const playRecordedSound = () => {
    console.log('recorded blob:', recordedBlob);
    if (recordedBlob) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(recordedBlob, (buffer) => {
        const source = audioContext.createBufferSource();
        // Apply detuning effect to the buffer
        const detuneBuffer = applyDetuneToBuffer(buffer, detuneValue);
        source.buffer = detuneBuffer;
        source.connect(audioContext.destination);
        source.start(0);
      });
    }
  };

  // Function to apply detuning effect to the buffer
  const applyDetuneToBuffer = (buffer, detune) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const detuneNode = audioContext.createBufferSource();
    detuneNode.buffer = buffer;
    detuneNode.detune.value = detune;
    
    const output = audioContext.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = output.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        outputData[i] = inputData[i];
      }
    }
    detuneNode.connect(audioContext.destination);
    detuneNode.start(0);
    return output;
  };

  useEffect(() => {
    console.log('Recorded Blob in Piano:', recordedBlob);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKey, recordedBlob]);

  return (
    <div className='piano'>
      <Key label="a" keyCode={65} onClick={handleKeyDown} />
      <Key label="s" keyCode={83} onClick={handleKeyDown} />
    </div>
  );
};

export default Piano;





