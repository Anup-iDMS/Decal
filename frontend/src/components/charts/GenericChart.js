import React from 'react';
import {Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';
import { logger } from './../../util/ConsoleHelper';

const GenericChart = ({ chartTitle, TypeOfChart, monthlySalesData, chartLables, chartData }) => {
  
  Chart.register(ChartDataLabels);

  logger("chartTitle === ", chartTitle)
  let srs = false
  let state = {}
  if(monthlySalesData!==undefined) {
      state = {
      labels: chartLables,
      datasets: [
        {
          label: '',
          display:false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          barThickness: 30,
          data: chartData
        }
      ]
    }
  }
   return (
     (monthlySalesData!==undefined?(
      <div>
        <TypeOfChart
          data={state}
          options={{
            responsive: true,
            layout: {
              padding: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
              }
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: false,
                    max: 60000
                  },
                },
              ],
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
                  return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
                },
                color: "black",
                align: "end",
                anchor: "end",
                font: { size: "14" },
               
              }
            },
            // legend:{
            //   display:false,
            //   position:'right'
            // }
          }}
        />
      </div>
     ):null)
      
   )
}

export default GenericChart
