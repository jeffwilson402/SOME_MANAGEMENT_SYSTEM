import React from "react";
import * as d3 from "d3";
import * as _ from "lodash";
import { BubbleData, Table22 } from "./BubbleData";

export class BubbleChart extends React.Component {
  static defaultProps = {
    data: [],
    useLabels: false,
    width: 600,
    height: 600,
  };

  table22 = Table22;

  constructor(props) {
    super(props);

    this.minValue = 1;
    this.maxValue = 100;
    this.mounted = false;
    this.state = {
      data: [],
    };

    this.circleCount = 14.5;

    this.radius = (this.props.height - 10) / 2;
    this.unit = this.radius / this.circleCount;

    this.radiusScale = this.radiusScale.bind(this);
    this.simulatePositions = this.simulatePositions.bind(this);
    this.renderBubbles = this.renderBubbles.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.minValue =
        0.95 *
        d3.min(this.props.data, (item) => {
          return item.type;
        });

      this.maxValue =
        1.05 *
        d3.max(this.props.data, (item) => {
          return item.type;
        });

      this.simulatePositions(this.props.data);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  radiusScale = (value) => {
    const fx = d3
      .scaleSqrt()
      .range([1, 50])
      .domain([this.minValue, this.maxValue]);

    return fx(value);
  };

  simulatePositions = (data: BubbleData[]) => {
    data = data
      .sort((a, b) => a.total - b.total)
      .map((item) => {
        item.radian = item.subCategory * this.table22.vLookup(item.type, 3);
        item.x =
          Math.cos(item.radian) *
          (6 - item.probability) *
          2.1 *
          this.table22.vLookup(item.type, 4);
        item.y =
          Math.sin(item.radian) *
          (6 - item.probability) *
          2.9 *
          this.table22.vLookup(item.type, 5);
        item.vx = Math.cos(item.radian) * item.probability;
        item.vy = Math.sin(item.radian) * item.probability;
        return item;
      });

    this.setState({ data });
  };

  renderBubbles = (data) => {
    const color = (index) => {
      return ["#6BC3CE", "#01A778", "#7BA448", "#F6A118", "#E31C4B"][index - 1];
    };

    // render circle and text elements inside a group
    const texts = _.map(data, (item, index) => {
      return (
        <g
          key={index}
          transform={`translate(${this.getX(item.x)}, ${this.getY(item.y)})`}
        >
          <circle
            r={item.total + 5}
            fill={color(item.impact)}
            stroke={d3.rgb(color(item.impact)).brighter(0.5)}
            strokeWidth="2"
          />
        </g>
      );
    });

    return texts;
  };

  getX = (val) => {
    // return (this.props.height / 2) * (1 / 5) + this.props.height / 2 - 10;
    return this.props.height / 2 + this.unit * val;
  };

  getY = (val) => {
    return this.props.height / 2 - this.unit * val;
  };

  drawRing = () => {
    const circles = _.map(_.range(5), (item) => {
      return (
        <circle
          r={this.unit * ((this.circleCount * (item + 1)) / 5)}
          stroke={"#3a9593"}
          cx={this.props.width / 2}
          cy={this.props.height / 2}
          strokeWidth={item * 2 + 1}
          fill="none"
        />
      );
    });

    return (
      <g>
        <line x1="300" y1="0" x2="300" y2="600" stroke={"#3a9593"} />
        <line x1="0" y1="300" x2="600" y2="300" stroke={"#3a9593"} />
        {circles}
        {/* <circle
          r={10}
          stroke={"#3a9593"}
          cx={this.getX(-1)}
          cy={this.getY(0)}
          strokeWidth={0}
          fill="#3a9593"
        /> */}
      </g>
    );
  };

  render() {
    if (this.state.data.length) {
      return (
        <div className="bubble-container">
          <span className="people-and-process">
            People <br /> and <br /> Process
          </span>
          <span className="data-and-access">
            Data <br /> and <br /> Access
          </span>
          <span className="asset-and-asset">Asset</span>
          <span className="technology">Technology</span>
          <div className="impact-container">
            <span>Impact</span>
            <div className="impact-item">
              <span className="impact-1"></span> {"  "} 1
            </div>
            <div className="impact-item">
              <span className="impact-2"></span> {"  "} 2
            </div>
            <div className="impact-item">
              <span className="impact-3"></span> {"  "} 3
            </div>
            <div className="impact-item">
              <span className="impact-4"></span> {"  "} 4
            </div>
            <div className="impact-item">
              <span className="impact-5"></span> {"  "} 5
            </div>
          </div>
          <h1 className="title">Risk Radar</h1>
          <div className="svg-container">
            <svg width={this.props.width} height={this.props.height}>
              {this.drawRing()}
              {this.renderBubbles(this.state.data)}
            </svg>
          </div>
        </div>
      );
    }

    return <div>Loading</div>;
  }
}
