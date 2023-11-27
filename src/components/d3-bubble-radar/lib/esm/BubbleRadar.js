var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var d3 = __importStar(require("d3"));
var lodash_1 = __importDefault(require("lodash"));
var Lookup_1 = require("./Lookup");
require("./App.css");
var BubbleRadar = /** @class */ (function (_super) {
  __extends(BubbleRadar, _super);
  function BubbleRadar(props) {
    var _a, _b, _c, _d;
    var _this = _super.call(this, props) || this;
    _this.totalSize = 5;
    _this.radius = 0;
    _this.table22 = Lookup_1.Table22;
    _this.svgRef = react_1.default.createRef();
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
    _this.state = {
      width: newWidth,
      height: newHeight,
      data: props.data,
    };
    _this.radius = height / 2;
    _this.unit = d3
      .scaleLinear()
      .domain([0, _this.totalSize])
      .range([0, _this.radius]);
    _this.color = d3
      .scaleLinear()
      .domain([1, 2, 3, 4, 5])
      .range(["#6bc3ce", "#01a778", "#7ba448", "#f6a118", "#e31c4b"]);
    // this.maxValue = d3.max(props.data, (item) => item.total);
    // this.minValue = d3.min
    _this.scaleRadius = d3
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
    return _this;
  }
  BubbleRadar.prototype.componentDidMount = function () {
    this.setState({});
    var svgEl = d3.select(this.svgRef.current);
    this.drawRing(svgEl);
  };
  BubbleRadar.prototype.componentDidUpdate = function () {
    var svgEl = d3.select(this.svgRef.current);
    svgEl.selectAll("*").remove();
    this.drawRing(svgEl);
    this.drawBubble(svgEl);
  };
  BubbleRadar.prototype.shouldComponentUpdate = function (nextProps) {
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
  };
  BubbleRadar.prototype.compareObject = function (x, y) {
    return JSON.stringify(x) === JSON.stringify(y);
  };
  BubbleRadar.prototype.cloneObject = function (data) {
    return JSON.parse(JSON.stringify(data));
  };
  BubbleRadar.prototype.drawBubble = function (svgEl) {
    var _this = this;
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
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
      })
      .on("mouseover", function (event, d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(
            '<div style="padding-bottom: 7px; font-weight: bold; font-size: 14px">' +
              d.subCategory +
              "</div>" +
              "Impact: " +
              d.impact +
              "<br />" +
              "Probability: " +
              d.probability +
              "<br/>" +
              "Total: " +
              d.total
          )
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 70 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });
    circles
      .transition()
      .duration(1000)
      .attr("fill-opacity", 1)
      .attr("r", function (item) {
        return _this.scaleRadius(item.total);
      })
      .attr("stroke-width", 2);
  };
  BubbleRadar.prototype.drawRing = function (svgEl) {
    var _this = this;
    svgEl
      .selectAll("circle")
      .data(lodash_1.default.range(this.totalSize))
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
  };
  BubbleRadar.prototype.render = function () {
    return react_1.default.createElement(
      react_1.default.Fragment,
      null,
      react_1.default.createElement(
        "div",
        { className: "bubble-container" },
        react_1.default.createElement(
          "span",
          { className: "people-and-process" },
          "People ",
          react_1.default.createElement("br", null),
          " and ",
          react_1.default.createElement("br", null),
          " Process"
        ),
        react_1.default.createElement(
          "span",
          { className: "data-and-access" },
          "Data ",
          react_1.default.createElement("br", null),
          " and ",
          react_1.default.createElement("br", null),
          " Access"
        ),
        react_1.default.createElement(
          "span",
          { className: "asset-and-asset" },
          "Asset"
        ),
        react_1.default.createElement(
          "span",
          { className: "technology" },
          "Technology"
        ),
        react_1.default.createElement(
          "div",
          { className: "impact-container" },
          react_1.default.createElement("span", null, "Impact"),
          react_1.default.createElement(
            "div",
            { className: "impact-item" },
            react_1.default.createElement("span", { className: "impact-1" }),
            " ",
            "  ",
            " 1"
          ),
          react_1.default.createElement(
            "div",
            { className: "impact-item" },
            react_1.default.createElement("span", { className: "impact-2" }),
            " ",
            "  ",
            " 2"
          ),
          react_1.default.createElement(
            "div",
            { className: "impact-item" },
            react_1.default.createElement("span", { className: "impact-3" }),
            " ",
            "  ",
            " 3"
          ),
          react_1.default.createElement(
            "div",
            { className: "impact-item" },
            react_1.default.createElement("span", { className: "impact-4" }),
            " ",
            "  ",
            " 4"
          ),
          react_1.default.createElement(
            "div",
            { className: "impact-item" },
            react_1.default.createElement("span", { className: "impact-5" }),
            " ",
            "  ",
            " 5"
          )
        ),
        react_1.default.createElement(
          "h1",
          { className: "title" },
          "Risk Radar"
        ),
        react_1.default.createElement(
          "div",
          { className: "svg-container" },
          react_1.default.createElement("svg", {
            ref: this.svgRef,
            width: this.state.width,
            height: this.state.height,
          })
        )
      )
    );
  };
  BubbleRadar.defaultProps = {
    dimensions: {
      margin: { left: 10, right: 10, top: 10, bottom: 10 },
      width: 600,
      height: 600,
    },
  };
  return BubbleRadar;
})(react_1.default.Component);
exports.default = BubbleRadar;
