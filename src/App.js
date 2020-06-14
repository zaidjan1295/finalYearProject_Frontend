import React, {useEffect, useState} from 'react';
import AnalysisSection from "./screen/AnalysisSection"
import { Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import io from "socket.io-client"
let endPoint = "http://localhost:5000";

let socket = io.connect(`${endPoint}`);
socket.on('connect', function() {
  socket.emit('conencted');
});

const setUrl = (name) => {
  return endPoint + '/static/' + name
}

const App = () => {
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
    const item = [videoUrl, 'Bangalore', JSON.stringify(msg), 'suspicios', undefined, history.lengt + 1]
    debugger
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

export default App