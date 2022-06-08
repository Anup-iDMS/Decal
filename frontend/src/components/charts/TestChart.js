import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Line } from "react-chartjs-2";
import annotationPlugin from 'chartjs-plugin-annotation';
import {Chart} from 'chart.js';

const data = [0, 10, 20, 10, 20, 55, 68, 78, 89, 89, 50];
const PURPLE = "#68057C";
const GREEN = "#5BB724";
const GREEN_LIGHT = "#57C592";
const RED = "#FF0000";
const BLUE = "#007EDF";
const WHITE = "#fff";

function TestChart() {
   Chart.register(annotationPlugin);
  const chartRef = useRef(null);
  const [legend, setLegend] = useState([]);

//   useEffect(() => {
//     let ref = chartRef.current;
//     ref.chartInstance.config.options.legendCallback();
//   }, [chartRef]);

  const dataBar = {
    labels: [
      "Janvier",
      "Fevrier",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Aout",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre"
    ],
    datasets: [
      {
        label: "Profit",
        type: "line",
        data: [20, 10, 20, 405, 545, 804, 1504, 1700],
        fill: false,

        backgroundColor: GREEN_LIGHT,
        borderColor: GREEN_LIGHT,
        hoverBackgroundColor: GREEN_LIGHT,
        hoverBorderColor: GREEN_LIGHT,
        order: 1
      }
    ]
  };

  const options = {
    legend: {
      position: "bottom",
      display: false
    },
    title: {
      display: true,
      text: "States",
      position: "bottom",
      fontSize: 25
    },
    legendCallback: function(chaart) {
      let legendItems = chartRef.current.chartInstance.legend.legendItems;
      setLegend(legendItems);
    },
    responsive: true,
    tooltips: {
      mode: "label"
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: true,
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          stacked: true,
          type: "linear",
          display: true,
          position: "right",
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          scaleLabel: {
            display: true,
            labelString: "Profit USD",
            fontSize: 25,
            fontColor: GREEN_LIGHT
          }
        },
        {
          display: true,
          position: "left",
          gridLines: {
            display: false,
            color: RED
          },
          labels: {
            display: false,
            show: false
          },
          scaleLabel: {
            display: true,
            labelString: "Units Sold",
            fontSize: 25,
            fontColor: PURPLE
          },
          ticks: {
            fontColor: WHITE
          }
        }
      ]
    },
      annotation: {
      annotations: [
        {
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          value: 1000,
          borderColor: BLUE,
          borderWidth: 2,
          label: {
            backgroundColor: RED,
            //content: "Test Label",
            enabled: true
          }
        }
      ]
    }
  };

  const listItemStyle = {
    color: "#333",
    listStyle: "none",
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    margin: "8px",
    justifyContent: "center",
    alignItems: "center"
  };

  const updateLegend = () =>
    chartRef.current.chartInstance.config.options.legendCallback();

  const getIsHidde = index => {
    let key = Object.keys(
      chartRef.current.chartInstance.config.data.datasets[index]._meta
    )[0];

    let hide =
      chartRef.current.chartInstance.config.data.datasets[index]._meta[key]
        .hidden;

    if (hide === null || hide === false) {
      return false;
    } else {
      return true;
    }
  };

  const setIsHide = index => {
    let key = Object.keys(
      chartRef.current.chartInstance.config.data.datasets[index]._meta
    )[0];
    let isHide =
      chartRef.current.chartInstance.config.data.datasets[index]._meta[key];

    if (getIsHidde(index) === false) {
      isHide.hidden = true;
      updateLegend();
    } else {
      isHide.hidden = false;
      updateLegend();
    }
  };

  const handleClickLegend = (e, i) => {
    e.persist();
    let text = e.currentTarget.innerText; // Profit

    setIsHide(0);
  };
  return (
    <div
      title={"title"}
      isLoading={false}
      style={{
        whiteSpace: "pre",
        display: "flex",
        flexDirection: "column",
        backgroundColor: WHITE
      }}
    >
      <Line
        getDatasetAtEvent={dataset => console.log("dataset", dataset)}
        onElementsClick={e => {
        }}
        ref={chartRef}
        data={dataBar}
        options={options}
      />

      <ul className="mt-8">
        {legend.length &&
          legend.map((item, key) => {
            return (
              <li key={key} onClick={handleClickLegend} style={listItemStyle}>
                {item.text}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default TestChart
