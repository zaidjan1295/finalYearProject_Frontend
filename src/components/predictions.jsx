import React from 'react';
import {Line} from 'react-chartjs-2';
import Loader from "./loader"
const Chart = (props) => {
    const {graphData} = props
    const data = {
        labels: graphData.map((item, index) => `frame ${index}`),
        datasets: [{
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0,
                data:graphData.map(item => Number(item))
            }
        ]
    }
    return (
      <div>
        {
          graphData.length 
          ? <Line
          width={600}
          height={500}
          data={data}
          options={{
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1,
                    }
                }]
            },
            point:{
                radius: 0
            },
            maintainAspectRatio: false ,
            responsive:false 
          }}
        />
        :
        <Loader />
        }
        
      </div>
    );
}

export default Chart