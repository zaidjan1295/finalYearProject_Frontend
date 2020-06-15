import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AnalysisSection from "./screen/AnalysisSection"
import { ListGroup, Form, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import io from "socket.io-client"
import DatePicker from "react-datepicker";
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import Navbar from './components/Navbar';

let endPoint = "http://localhost:5000";

let socket = io.connect(`${endPoint}`);
socket.on('connect', function() {
  socket.emit('conencted');
});

const setUrl = (name) => {
  return endPoint + '/static/' + name
}

const App = () => {
  return (
    <Router>
     <Navbar />
      <Switch>
        <Route path="/queryPage">
          <QueryPage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  const [graphData, setGraphData] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [history, setHistory] = useState([]);
  useEffect(() => {
    axios.get(`${endPoint}/logs`)
      .then(data => {
        setHistory(data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, []);
  const toggleIsVisible = (id) => {
    const newHistory = history.map(item => {
      if(item[5] !== id){
        return item
      } else {
        item[6] = !item[6]
        const newItem = item
        return newItem
      }
    })
    setHistory(newHistory)
  }
  const appendToHistory = (msg) => {
    const item = [videoUrl, 'Bangalore', JSON.stringify(msg), 'suspicios', undefined, history.length + 1]
    setHistory([item, ...history])
  }
  socket.on("graphData", msg => {
    setGraphData(msg)
    appendToHistory(msg)
  });
  socket.on("uploadedFile", msg => {
    setGraphData([])
    setVideoUrl(msg)
  });

  return (
    <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '2%', marginBottom: '2%'}}>
        <Card.Title>Video Analysis</Card.Title>
        { videoUrl !== "" &&
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly"}}>
            <Card style={{ width: '90rem' }}>
            <Card.Body>
              <Card.Title>Video Being Processed</Card.Title>
              <Card.Text>
              <AnalysisSection videoUrl={setUrl(videoUrl)} graphData={graphData}/>
              </Card.Text>
            </Card.Body>
          </Card>
          </div>
        }
        <div style={{marginTop: "2%", marginBottom: "2%"}}>
          <Card.Title>History</Card.Title>
          <ListGroup >
          {history.map((item, index) => {
            return (
                <ListGroup.Item key={index} action onClick={() => toggleIsVisible(item[5])}>
                  {item[0]}
                  {item[6] && <AnalysisSection graphData={JSON.parse(item[2])} videoUrl={setUrl(item[0])}/>}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div>
      </div>
  );
}





function QueryPage() {
  const [selectedDate, setSelectedDate] = useState()
  const [location, setLocation] = useState("")
  const [score, setScore] = useState("")
  const [history, setHistory] = useState([])
  const options = [
    { value: '100', label: 'DEFCON-1' },
    { value: '90', label: 'DEFCON-2' },
    { value: '80', label: 'DEFCON-3' },
    { value: '70', label: 'DEFCON-4' },
    { value: '60', label: 'DEFCON-5' },
    { value: '50', label: 'DEFCON-6' },
    { value: '40', label: 'DEFCON-7' },
    { value: '30', label: 'DEFCON-8' },
    { value: '20', label: 'DEFCON-9' },
    { value: '10', label: 'DEFCON-10' },
    { value: '0', label: 'DEFCON-11' },

  ]
  const onSubmit = () => {
    const payload = { params: { date: moment(selectedDate).format('YYYY-MM-DD'), location, score: score.value}}
    debugger
    axios.get(`${endPoint}/query`, payload)
      .then(data => {
        setHistory(data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleChangeLocation = (e) => {
    setLocation(e.target.value)
  }
  const toggleIsVisible = (id) => {
    const newHistory = history.map(item => {
      if(item[5] !== id){
        return item
      } else {
        item[6] = !item[6]
        const newItem = item
        return newItem
      }
    })
    setHistory(newHistory)
  }
  return (
    <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '2%', marginBottom: '2%'}}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly"}}>
      <Card style={{ width: '100rem' }}>
        <Card.Body>
          <Card.Text>
          <Form.Group controlId="formlocation">
            <Form.Label>Location :</Form.Label>
            <Form.Control
              onChange={handleChangeLocation}
              type="text"
              location="location"
              placeholder="Full location"
            />
          </Form.Group>
          <Select options={options} onChange={(selected) => {setScore(selected)}}/>
          <Form.Group> 
            <div style={{marginTop: '15px'}}>
              <Form.Label>Dated:</Form.Label>
              <DatePicker
                width={100}
                className="form-control"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
          </Form.Group>
          </Card.Text>
          <Button onClick={onSubmit} variant="primary">Submit</Button>
        </Card.Body>
      </Card>
      </div>
      {history.length !== 0 &&
      <div style={{marginTop: "2%", marginBottom: "2%"}}>
          <Card.Title>History</Card.Title>
          <ListGroup >
          {history.map((item, index) => {
            return (
                <ListGroup.Item key={index} action onClick={() => toggleIsVisible(item[5])}>
                  {item[0]}
                  {item[6] && <AnalysisSection graphData={JSON.parse(item[2])} videoUrl={setUrl(item[0])}/>}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div>
      }
    </div>     
  );
}

export default App;