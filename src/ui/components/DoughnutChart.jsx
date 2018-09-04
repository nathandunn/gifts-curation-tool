import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/DoughnutChart.css';

const DoughnutChart = (props) => {
  const { percent } = props;
  let leftTransformerDegree = '0deg';
  let rightTransformerDegree = '0deg';
  if (percent >= 50) {
    rightTransformerDegree = '180deg';
    leftTransformerDegree = `${(percent - 50) * 3.6}deg`;
  } else {
    rightTransformerDegree = `${percent * 3.6}deg`;
    leftTransformerDegree = '0deg';
  }
  return (
    <div
      className="circle"
      style={{
        width: props.radius * 2,
        height: props.radius * 2,
        borderRadius: props.radius,
        backgroundColor: props.bgcolor,
      }}
    >
      <div
        className="left-wrap"
        style={{
          width: props.radius,
          height: props.radius * 2,
          left: 0,
        }}
      >
        <div
          className="loader"
          id="id1"
          style={{
            left: props.radius,
            width: props.radius,
            height: props.radius * 2,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: props.color,
            transform: `rotate(${leftTransformerDegree})`,
          }}
        />
      </div>
      <div
        className="right-wrap"
        style={{
          width: props.radius,
          height: props.radius * 2,
          left: props.radius,
        }}
      >
        <div
          className="loader2"
          id="id2"
          style={{
            left: -props.radius,
            width: props.radius,
            height: props.radius * 2,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: props.color,
            transform: `rotate(${rightTransformerDegree})`,
          }}
        />
      </div>
      <div
        className="inner-circle"
        style={{
          left: props.borderWidth,
          top: props.borderWidth,
          width: (props.radius - props.borderWidth) * 2,
          height: (props.radius - props.borderWidth) * 2,
          borderRadius: props.radius - props.borderWidth,
          backgroundColor: props.innerColor,
        }}
      >
        {props.children ? (
          props.children
        ) : (
          <span className={`text ${props.textStyle}`}>{props.percent}%</span>
        )}
      </div>
    </div>
  );
};

DoughnutChart.propTypes = {
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  innerColor: PropTypes.string,
  radius: PropTypes.number,
  percent: PropTypes.number,
  borderWidth: PropTypes.number,
  textStyle: PropTypes.string,
};

DoughnutChart.defaultProps = {
  color: '#22424B',
  radius: 60,
  percent: 0,
  borderWidth: 10,
  bgcolor: '#cacaca',
  innerColor: '#fff',
  textStyle: '',
};

export default DoughnutChart;
