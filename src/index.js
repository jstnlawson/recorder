import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest, put } from 'redux-saga/effects';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

// Reducer
const initialState = {
  recordedBlob: null,
};

const voiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_RECORDED_BLOB':
      return { ...state, recordedBlob: action.payload };
    default:
      return state;
  }
};

// Actions
const setRecordedBlob = (blob) => ({
  type: 'SET_RECORDED_BLOB',
  payload: blob,
});

// Saga
function* addSampleToServer(action) {
  try {
    const formData = new FormData();
    formData.append('audio', action.payload);
    //let the server know the file type
    const config = {
      headers: {
        'Content-Type': 'audio/wav', 
      },
    };
    console.log('action.payload right befor axios:', action.payload)
    yield axios.post('/api/sampler', formData, config);
    yield put(setRecordedBlob(null));
  } catch (error) {
    console.error('Error adding sample:', error);
  }
}

function* watchAddSample() {
  yield takeLatest('ADD_SAMPLE', addSampleToServer);
}

// Create the Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store
const store = createStore(
  combineReducers({ voice: voiceReducer }),
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Run the rootSaga to start Redux Saga
sagaMiddleware.run(watchAddSample);

const root = createRoot(document.getElementById('root'));
  root.render(
  <React.StrictMode>
    {/* Wrap the App component with the Redux Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
