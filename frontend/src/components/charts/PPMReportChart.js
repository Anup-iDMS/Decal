import React from 'react';
import {Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Chart} from 'chart.js';
import { logger } from './../../util/ConsoleHelper';

const PPMReportChart = ({ chartTitle, TypeOfChart, chartLables, chartData, targetPPMLevel }) => {
  
  Chart.register(ChartDataLabels);
  //Chart.register(annotationPlugin);

  logger("chartTitle === ", chartTitle)
  let srs = false
  let state = {}
  if(chartData!==undefined) {
      state = {
      labels: chartLables,
      datasets: [
        {
          label: '',
          type: 'bar',
          display:false,
          backgroundColor: [
            'rgba(91, 155, 213, 1)',
          ],
          borderColor: [
            'rgba(91, 155, 213, 1)',
          ],
          borderWidth: 1,
          barThickness: 30,
          data: chartData,
        },
        {
          label: '',
          type: 'line',
          display:false,
          lineTension: 0,
          fill: true,
          backgroundColor: [
            "rgba(248,203,173,0.4)"
          ],
          // borderColor: [
          //   'red',
          // ],
          borderWidth: 1,
          barThickness: 30,
          data: targetPPMLevel,//[1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0],
          pointRadius: 0,
        }
      ]
    }
  }

  return (
     (chartData!==undefined?(
      <div>
        <TypeOfChart
          data={state}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
              }
            },
            scales:
            {
                yAxes: [{
                    gridLines : {
                      display: false,
                    }
                }]
            },
            legend: {
              display: false
            },
            tooltips: {
              enabled: false
            },
            title:{
              display:false,
              text:'Data',
              fontSize:20
            },
            plugins: {
              legend: {
                display: false
              },
              datalabels: {
                display: function(context) {
                  if(context.dataset.data[context.dataIndex] === 1000) {
                    console.log("context.dataset.data[context.dataIndex] >>>>>>> ", context.dataset.data[context.dataIndex])
                    return '';
                  }
                  return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
                },
                color: "black",
                align: "end",
                anchor: "end",
                font: { size: "14" },
               
              },
              annotation: {
                drawTime: 'afterDatasetsDraw',
                annotations: [
                  {
                    drawTime: 'afterDraw', //
                    type: "line",
                    mode: "horizontal",
                  },
                ]
              },
            },
          }}
        />
      </div>
     ):null)
      
   )
}

export default PPMReportChart
