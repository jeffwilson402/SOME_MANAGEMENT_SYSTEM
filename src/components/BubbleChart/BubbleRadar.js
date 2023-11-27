var createReactClass = require('create-react-class');
var TableData = require("./Lookup");
var react = require("react");
var d3 = require("d3");
var lodash = require("lodash");
require("./App.css");

var BubbleRadar = createReactClass({
    BubbleRadar: function(props) {
        // super(props);
        this.svgRef = react.default.createRef();
        this.totalSize = 5;
        this.radius = 0;
        this.unit = d3
          .scaleLinear()
          .domain([0, this.totalSize])
          .range([0, this.radius]);
        this.tableData = TableData;
        this.color = d3
          .scaleLinear()
          .domain([1, 2, 3, 4, 5])
          .range(["#6bc3ce", "#01a778", "#7ba448", "#f6a118", "#e31c4b"]);
        this.scaleRadius = d3
          .scaleLinear()
          .domain([
            d3.min(props.data, function (item) {
              return item.total;
            }),
            d3.max(props.data, function (item) {
              return item.total;
            }),
          ])
          .range([10, 25]);
        var _a, _b, _c, _d;
        var _e = props.dimensions,
          width = _e.width,
          height = _e.height,
          margin = _e.margin;
        var newWidth =
          width +
          ((_a = margin.left) !== null && _a !== void 0 ? _a : 0) +
          ((_b = margin.right) !== null && _b !== void 0 ? _b : 0);
        var newHeight =
          height +
          ((_c = margin.top) !== null && _c !== void 0 ? _c : 0) +
          ((_d = margin.bottom) !== null && _d !== void 0 ? _d : 0);
        this.state = {
          width: newWidth,
          height: newHeight,
        };
    
        this.radius = height / 2;
        return this;
    },
    getDefaultProps: function(){
        return {
            dimensions: {
                margin: { left: 10, right: 10, top: 10, bottom: 10 },
                width: 600,
                height: 600,
              },
        }
    },
    render: function () {
        return react.default.createElement(
          react.default.Fragment,
          null,
          react.default.createElement(
            "div",
            { className: "bubble-container" },
            react.default.createElement(
              "span",
              { className: "people-and-process" },
              "People ",
              react.default.createElement("br", null),
              " and ",
              react.default.createElement("br", null),
              " Process"
            ),
            react.default.createElement(
              "span",
              { className: "data-and-access" },
              "Data ",
              react.default.createElement("br", null),
              " and ",
              react.default.createElement("br", null),
              " Access"
            ),
            react.default.createElement(
              "span",
              { className: "asset-and-asset" },
              "Asset"
            ),
            react.default.createElement(
              "span",
              { className: "technology" },
              "Technology"
            ),
            react.default.createElement(
              "div",
              { className: "impact-container" },
              react.default.createElement("span", null, "Impact"),
              react.default.createElement(
                "div",
                { className: "impact-item" },
                react.default.createElement("span", { className: "impact-1" }),
                " ",
                "  ",
                " 1"
              ),
              react.default.createElement(
                "div",
                { className: "impact-item" },
                react.default.createElement("span", { className: "impact-2" }),
                " ",
                "  ",
                " 2"
              ),
              react.default.createElement(
                "div",
                { className: "impact-item" },
                react.default.createElement("span", { className: "impact-3" }),
                " ",
                "  ",
                " 3"
              ),
              react.default.createElement(
                "div",
                { className: "impact-item" },
                react.default.createElement("span", { className: "impact-4" }),
                " ",
                "  ",
                " 4"
              ),
              react.default.createElement(
                "div",
                { className: "impact-item" },
                react.default.createElement("span", { className: "impact-5" }),
                " ",
                "  ",
                " 5"
              )
            ),
            react.default.createElement("h1", { className: "title" }, "Risk Radar"),
            react.default.createElement(
              "div",
              { className: "svg-container" },
              react.default.createElement("svg", {
                ref: this.svgRef,
                width: this.state.width,
                height: this.state.height,
              })
            )
          )
        );
    }, 
    componentDidMount: function () {
        this.setState({});
        var svgEl = d3.select(this.svgRef.current);
        this.drawRing(svgEl);
    },
    componentDidUpdate: function () {
        var svgEl = d3.select(this.svgRef.current);
        svgEl.selectAll("*").remove();
        this.drawRing(svgEl);
        this.drawBubble(svgEl);
    },
    shouldComponentUpdate: function (nextProps) {
        if (!this.compareObject(nextProps.data, this.props.data)) {
          this.scaleRadius = d3
            .scaleLinear()
            .domain([
              d3.min(nextProps.data, function (item) {
                return item.total;
              }),
              d3.max(nextProps.data, function (item) {
                return item.total;
              }),
            ])
            .range([10, 25]);
          return true;
        }
        return false;
    },
    compareObject: function (x, y) {
        return JSON.stringify(x) === JSON.stringify(y);
    },
    cloneObject: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    drawBubble: function (svgEl) {
        var _this = this;
    
        var circles = svgEl
          .selectAll(".bubble")
          .data(
            this.cloneObject(this.props.data)
              .map(function (item) {
                var _a;
                item.radian =
                  ((_a = item.subCategoryIndex) !== null && _a !== void 0
                    ? _a
                    : 0) * _this.table22.vLookup(item.type, 3);
                return item;
              })
              .sort(function (a, b) {
                return a.total - b.total;
              })
          )
          .enter()
          .append("circle")
          .attr("class", "bubble")
          .attr("cx", function (item) {
            var _a;
            return (
              _this.state.height / 2 +
              Math.cos((_a = item.radian) !== null && _a !== void 0 ? _a : 0) *
                _this.unit(6 - item.probability) *
                _this.table22.vLookup(item.type, 4)
            );
          })
          .attr("cy", function (item) {
            var _a;
            return (
              _this.state.height / 2 -
              Math.sin((_a = item.radian) !== null && _a !== void 0 ? _a : 0) *
                _this.unit(6 - item.probability) *
                _this.table22.vLookup(item.type, 5)
            );
          })
          .attr("r", 0)
          .attr("fill", function (item) {
            return _this.color(item.impact);
          })
          .attr("stroke", function (item) {
            return d3.rgb(_this.color(item.impact)).brighter(0.5).toString();
          });
        circles
          .transition()
          .duration(1000)
          .attr("fill-opacity", 1)
          .attr("r", function (item) {
            return _this.scaleRadius(item.total);
          })
          .attr("stroke-width", 2);
    },
    drawRing: function (svgEl) {
        var _this = this;
        svgEl
          .selectAll("circle")
          .data(lodash.default.range(this.totalSize))
          .enter()
          .append("circle")
          .style("stroke", "#3a9593")
          .style("fill", "none")
          .attr("r", function (d) {
            return _this.unit(d + 1);
          })
          .attr("cx", this.state.height / 2)
          .attr("cy", this.state.height / 2)
          .attr("stroke-width", function (d) {
            return d * 2 + 1;
          });
        svgEl
          .append("line")
          .style("stroke", "#3a9593")
          .attr("x1", this.state.width / 2)
          .attr("y1", 0)
          .attr("x2", this.state.width / 2)
          .attr("y2", this.state.height);
        svgEl
          .append("line")
          .style("stroke", "#3a9593")
          .attr("x1", 0)
          .attr("y1", this.state.height / 2)
          .attr("x2", this.state.width)
          .attr("y2", this.state.height / 2);
    }      
});

exports.default = BubbleRadar;
