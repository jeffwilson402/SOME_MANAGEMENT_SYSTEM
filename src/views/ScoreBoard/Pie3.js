/* eslint-disable  no-redeclare */

import React, { useEffect, useLayoutEffect, useRef } from "react";
import * as d3 from "d3";

let ir = 0;

export default function Pie3(props) {
  const {
    data,
    innerRadius = 0,
    pieRadius = 180,
    pieHeight = 37,
    ry = 40,
    rotation = 260,
    labelHeight = 10,
    legendTextSize = 12,
    legendPadding = 5,
    title,
    titleSize = 20,
    backgroundColor = "white",
    responsive = false,
  } = props;
  const [width, setWidth] = React.useState(props.width);
  const [height, setHeight] = React.useState(responsive ? props.width * 0.39 : props.height);
  const [h, setH] = React.useState(pieHeight);

  const [rx, setRx] = React.useState(pieRadius);

  const d3Ref = useRef();

  useLayoutEffect(() => {
    const updateSize = () => {
      const totalWidth = d3Ref.current.getBoundingClientRect().width;
      setWidth(totalWidth);
      if(responsive ) {
        setHeight(totalWidth * 0.4);
        setH((totalWidth * 0.4) * 0.1);
        if(totalWidth * 0.4 < 250) {
          setRx((totalWidth* 0.4) * 0.5)
        } else {
          if (totalWidth * 0.47 < pieRadius) {
            setRx(totalWidth * 0.47);
          } else {
            setRx(pieRadius)
          }
        }
      }
      else if (totalWidth * 0.47 < pieRadius) {
        setRx(totalWidth * 0.47);
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (d3Ref.current && width) {
      const pie = d3
        .pie()
        .sort(null)
        .value((d) => d.value);

      const colorPie = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randomColor;
      };

      const _data = pie(data).map((d) => {
        if (!d.data.color) d.data.color = colorPie();

        return Object.assign(d, {
          startAngle: d.startAngle + (Math.PI * 2 * (rotation % 360)) / 360,
          endAngle: d.endAngle + (Math.PI * 2 * (rotation % 360)) / 360,
        });
      });

      const legendX = d3
        .scaleSequential()
        .domain([0, 4])
        .rangeRound([0, width]);

      const svgNode = d3.select(d3Ref.current);

      svgNode.selectAll("*").remove();

      if (title && width) {
        svgNode
          .append("text")
          .text(title)
          .attr("fill", "#1c1c1c")
          .style("font-size", titleSize)
          .attr("dx", width / 2)
          .attr("dy", 30)
          .style("font-weight", 600)
          .style("text-anchor", "middle");
      }

      svgNode.append("g").attr("class", "pie-d3");

      const ryConverted = (ry / 90) * rx;

      draw(
        svgNode,
        "pie-d3",
        _data,
        width / 2,
        height / 2,
        rx,
        ryConverted,
        h,
        innerRadius
      );

      const legend = svgNode
        .selectAll(".legend")
        .data(_data)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d) => {
          return `translate(${legendPadding * 4 + legendX(d.index % 4)}, ${
            height -
            labelHeight * 5.3 +
            labelHeight * 2 * (Math.floor(d.index / 4) + 1)
          })`;
        });

      legend
        .append("rect")
        .attr("width", labelHeight)
        .attr("height", labelHeight)
        .attr("fill", (d) => d.data.color);

      legend
        .append("text")
        .text((d) => d.data.label)
        .attr("x", labelHeight + legendPadding)
        .attr("y", labelHeight)
        .attr("fill", (d) => d.data.color)
        .style("font-weight", 400)
        .style("font-size", legendTextSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, d3Ref, width, height]);

  return (
    <svg
      ref={d3Ref}
      width={"100%"}
      height={height + "px"}
      style={{ background: backgroundColor }}
    />
  );
}

function pieCorner(d, rx, ry, h) {
  //  Calculating  right corner surface key points
  var sxFirst = ir * rx * Math.cos(d.endAngle);
  var syFirst = ir * ry * Math.sin(d.endAngle);
  var sxSecond = rx * Math.cos(d.endAngle);
  var sySecond = ry * Math.sin(d.endAngle);
  var sxThird = sxSecond;
  var syThird = sySecond + h;
  var sxFourth = sxFirst;
  var syFourth = syFirst + h;

  // Creating custom path based on calculation
  return `
    M ${sxFirst} ${syFirst} 
    L ${sxSecond} ${sySecond}
    L ${sxThird} ${syThird} 
    L ${sxFourth} ${syFourth}
    z
    `;
}

function pieCornerSurface(d, rx, ry, h) {
  //  Calculating corner left surface key points
  var sxFirst = ir * rx * Math.cos(d.startAngle);
  var syFirst = ir * ry * Math.sin(d.startAngle);
  var sxSecond = rx * Math.cos(d.startAngle);
  var sySecond = ry * Math.sin(d.startAngle);
  var sxThird = sxSecond;
  var syThird = sySecond + h;
  var sxFourth = sxFirst;
  var syFourth = syFirst + h;

  // Creating custom path based on calculation
  return `
    M ${sxFirst} ${syFirst} 
    L ${sxSecond} ${sySecond}
    L ${sxThird} ${syThird} 
    L ${sxFourth} ${syFourth}
    z
  `;
}

function draw(
  svg,
  id,
  _data,
  x /*center x*/,
  y /*center y*/,
  rx /*radius x*/,
  ry /*radius y*/,
  h /*height*/,
  innerRadius /*inner radius*/,
  partial
) {
  ir = innerRadius;

  var slices = svg
    .select(`.${id}`)
    .append("g")
    .attr("transform", "translate(" + x + "," + y + ")")
    .attr("class", "slices");

  const cornerSliceElements = slices
    .selectAll(".cornerSlices")
    .data(_data.map((d) => Object.assign({}, d)))
    .enter()
    .append("path")
    .attr("class", "cornerSlices")
    .style("fill", function (d) {
      return d3.hsl(d.data.color).darker(0.7);
    })
    .attr("d", function (d) {
      return pieCorner(d, rx - 0.5, ry - 0.5, h);
    })
    .each(function (d) {
      this._current = d;
    })
    .attr("opacity", (d, i) => (i || !partial ? 1 : 0))
    .classed("slice-sort", true)
    .style("stroke", function (d) {
      return d3.hsl(d.data.color).darker(0.7);
    });

  //--------------
  const cornerSliceSurfaceElements = slices
    .selectAll(".cornerSlicesSurface")
    .data(_data.map((d) => Object.assign({}, d)))
    .enter()
    .append("path")
    .attr("class", "cornerSlicesSurface")
    .style("fill", function (d) {
      return d3.hsl(d.data.color).darker(0.7);
    })
    .attr("d", function (d) {
      return pieCornerSurface(d, rx - 0.5, ry - 0.5, h);
    })
    .each(function (d) {
      this._current = d;
    })
    .attr("opacity", (d, i) => (i || !partial ? 1 : 0))
    .classed("slice-sort", true)
    .style("stroke", function (d) {
      return d3.hsl(d.data.color).darker(0.7);
    });

  slices
    .selectAll(".innerSlice")
    .data(_data.map((d) => Object.assign({}, d)))
    .enter()
    .append("path")
    .attr("class", "innerSlice")
    .style("fill", function (d) {
      return d3.hsl(d.data.color).darker(2);
    })
    .attr("d", function (d) {
      return pieInner(d, rx + 0.5, ry + 0.5, h, ir);
    })
    .each(function (d) {
      this._current = d;
    })
    .attr("opacity", (d, i) => (i || !partial ? 1 : 0))
    .classed("slice-sort", true)
    .style("stroke", function (d) {
      return d3.hsl(d.data.color).darker(2);
    });

  cornerSliceElements.sort(function (a, b) {
    const angleA = a.endAngle;
    const angleB = b.endAngle;
    return Math.sin(angleA) <= Math.sin(angleB) ? -1 : 1;
  });


  cornerSliceSurfaceElements.sort(function (a, b) {
    const angleA = a.startAngle;
    const angleB = b.startAngle;
    return Math.sin(angleA) <= Math.sin(angleB) ? -1 : 1;
  });

  slices.selectAll(".slice-sort").sort(function (a, b) {
    const first = slices
      .selectAll(".slice-sort")
      .filter((d) => d === a)
      .node();
    const second = slices
      .selectAll(".slice-sort")
      .filter((d) => d === b)
      .node();
    return first.getBoundingClientRect().top <
      second.getBoundingClientRect().top
      ? -1
      : 1;
  });

  slices
    .selectAll(".outerSlice")
    .data(_data)
    .enter()
    .append("path")
    .attr("class", "outerSlice")
    .style("fill", function (d) {
      return d3.hsl(d.data.color).darker(0.7);
    })
    .attr("d", function (d) {
      return pieOuter(d, rx - 0.5, ry - 0.5, h);
    })
    .each(function (d) {
      this._current = d;
    })
    //.style("stroke", function(d) { return d3.hsl(d.data.color).darker(0.7); })
    .attr("opacity", (d, i) => (i || !partial ? 1 : 0)); //

  slices
    .selectAll(".topSlice")
    .data(_data)
    .enter()
    .append("path")
    .attr("class", "topSlice")
    .style("fill", function (d) {
      return d.data.color;
    })
    .style("stroke", function (d) {
      return d.data.color;
    })
    .attr("d", function (d) {
      return pieTop(d, rx, ry, ir);
    })
    .each(function (d) {
      this._current = d;
    })
    .attr("opacity", (d, i) => (i || !partial ? 1 : 0));

  slices
    .selectAll("text")
    .data(_data)
    .enter()
    .append("text")
    .text((d) => (d.data.value ? d.data.value : ""))
    .attr("transform", (d) => {
      return `translate(${pieText(d, rx, ry, ir)})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", 17)
    .style("font-weight", 500)
    .style("fill", "white");
}

function pieInner(d, rx, ry, h, ir) {
  // Normalize angles before we start any calculations
  var startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle;
  var endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle;

  // Take care of corner cases
  if (d.startAngle > Math.PI * 2 && d.endAngle < Math.PI * 3) {
    return "";
  }

  if (
    d.startAngle >= Math.PI * 2 &&
    d.endAngle >= Math.PI * 2 &&
    d.endAngle <= Math.PI * 3
  ) {
    return "";
  }

  // Reassign startAngle  and endAngle based on their positions
  if (d.startAngle <= Math.PI && d.endAngle > Math.PI * 2) {
    startAngle = Math.PI;
    endAngle = 2 * Math.PI;
  }
  if (d.startAngle > Math.PI && d.endAngle >= Math.PI * 3) {
    endAngle = 2 * Math.PI;
  }
  if (
    d.startAngle > Math.PI &&
    d.endAngle > Math.PI * 2 &&
    d.endAngle < Math.PI * 3
  ) {
    endAngle = 2 * Math.PI;
  }
  if (
    d.startAngle > Math.PI &&
    d.startAngle < Math.PI * 2 &&
    d.endAngle > Math.PI * 3
  ) {
    endAngle = 2 * Math.PI;
    startAngle = Math.PI;
  }
  if (
    d.startAngle > Math.PI &&
    d.startAngle < Math.PI * 2 &&
    d.endAngle > Math.PI * 3
  ) {
    endAngle = 2 * Math.PI;
    startAngle = Math.PI;
  }
  if (
    d.startAngle > Math.PI &&
    d.startAngle < Math.PI * 2 &&
    d.endAngle > Math.PI * 3
  ) {
    startAngle = Math.PI;
    endAngle = Math.PI + (d.endAngle % Math.PI);
  }
  if (
    d.startAngle > Math.PI * 2 &&
    d.startAngle < Math.PI * 3 &&
    d.endAngle > Math.PI * 3
  ) {
    startAngle = Math.PI;
    endAngle = Math.PI + (d.endAngle % Math.PI);
  }
  if (d.startAngle > Math.PI * 3 && d.endAngle > Math.PI * 3) {
    startAngle = d.startAngle % (Math.PI * 2);
    endAngle = d.endAngle % (Math.PI * 2);
  }

  // Calculating shape key points
  var sx = ir * rx * Math.cos(startAngle),
    sy = ir * ry * Math.sin(startAngle),
    ex = ir * rx * Math.cos(endAngle),
    ey = ir * ry * Math.sin(endAngle);

  // Creating custom path  commands based on calculation
  var ret = [];
  ret.push(
    "M",
    sx,
    sy,
    "A",
    ir * rx,
    ir * ry,
    "0 0 1",
    ex,
    ey,
    "L",
    ex,
    h + ey,
    "A",
    ir * rx,
    ir * ry,
    "0 0 0",
    sx,
    h + sy,
    "z"
  );

  // If shape is big enough, that it needs two separate outer shape , then draw second shape as well
  if (
    d.startAngle > Math.PI &&
    d.startAngle < Math.PI * 2 &&
    d.endAngle > Math.PI * 3
  ) {
    startAngle = d.startAngle % (Math.PI * 2);
    endAngle = Math.PI * 2;
    var sx = ir * rx * Math.cos(startAngle),
      sy = ir * ry * Math.sin(startAngle),
      ex = ir * rx * Math.cos(endAngle),
      ey = ir * ry * Math.sin(endAngle);
    ret.push(
      "M",
      sx,
      sy,
      "A",
      ir * rx,
      ir * ry,
      "0 0 1",
      ex,
      ey,
      "L",
      ex,
      h + ey,
      "A",
      ir * rx,
      ir * ry,
      "0 0 0",
      sx,
      h + sy,
      "z"
    );
  }

  // Assemble shape commands
  return ret.join(" ");
}

function pieOuter(d, rx, ry, h) {
  // Process corner Cases
  if (
    d.endAngle === Math.PI * 2 &&
    d.startAngle > Math.PI &&
    d.startAngle < Math.PI * 2
  ) {
    return "";
  }
  if (
    d.startAngle > Math.PI * 3 &&
    d.startAngle < Math.PI * 4 &&
    d.endAngle > Math.PI * 3 &&
    d.endAngle <= Math.PI * 4
  ) {
    return "";
  }

  // Reassign startAngle  and endAngle based on their positions
  var startAngle = d.startAngle;
  var endAngle = d.endAngle;
  if (d.startAngle > Math.PI && d.startAngle < Math.PI * 2) {
    startAngle = Math.PI;
    if (d.endAngle > Math.PI * 2) {
      startAngle = 0;
    }
  }
  if (d.endAngle > Math.PI && d.endAngle < Math.PI * 2) {
    endAngle = Math.PI;
  }
  if (d.startAngle > Math.PI * 2) {
    startAngle = d.startAngle % (Math.PI * 2);
  }
  if (d.endAngle > Math.PI * 2) {
    endAngle = d.endAngle % (Math.PI * 2);
    if (d.startAngle <= Math.PI) {
      endAngle = Math.PI;
      startAngle = 0;
    }
  }
  if (d.endAngle > Math.PI * 3) {
    endAngle = Math.PI;
  }
  if (d.startAngle < Math.PI && d.endAngle >= 2 * Math.PI) {
    endAngle = Math.PI;
    startAngle = d.startAngle;
  }

  // Calculating shape key points
  var sx = rx * Math.cos(startAngle),
    sy = ry * Math.sin(startAngle),
    ex = rx * Math.cos(endAngle),
    ey = ry * Math.sin(endAngle);

  // Creating custom path  commands based on calculation
  var ret = [];
  ret.push(
    "M",
    sx,
    h + sy,
    "A",
    rx,
    ry,
    "0 0 1",
    ex,
    h + ey,
    "L",
    ex,
    ey,
    "A",
    rx,
    ry,
    "0 0   0",
    sx,
    sy,
    "z"
  );

  // If shape is big enough, that it needs two separate outer shape , then draw second shape as well
  if (d.startAngle < Math.PI && d.endAngle >= 2 * Math.PI) {
    startAngle = 0;
    endAngle = d.endAngle;
    var sx = rx * Math.cos(startAngle),
      sy = ry * Math.sin(startAngle),
      ex = rx * Math.cos(endAngle),
      ey = ry * Math.sin(endAngle);
    ret.push(
      "M",
      sx,
      h + sy,
      "A",
      rx,
      ry,
      "0 0 1",
      ex,
      h + ey,
      "L",
      ex,
      ey,
      "A",
      rx,
      ry,
      "0 0   0",
      sx,
      sy,
      "z"
    );
  }

  // Assemble shape commands
  return ret.join(" ");
}

function pieText(d, rx, ry, ir) {
  const middleAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
  const sx = rx * 0.8 * Math.cos(middleAngle),
    sy = ry * 0.8 * Math.sin(middleAngle);

  return [sx, sy];
}

function pieTop(d, rx, ry, ir) {
  // If angles are equal, then we got nothing to draw
  if (d.endAngle - d.startAngle === 0) return "M 0 0";

  // Calculating shape key points
  var sx = rx * Math.cos(d.startAngle),
    sy = ry * Math.sin(d.startAngle),
    ex = rx * Math.cos(d.endAngle),
    ey = ry * Math.sin(d.endAngle);

  // Creating custom path based on calculation
  var ret = [];
  ret.push(
    "M",
    sx,
    sy,
    "A",
    rx,
    ry,
    "0",
    d.endAngle - d.startAngle > Math.PI ? 1 : 0,
    "1",
    ex,
    ey,
    "L",
    ir * ex,
    ir * ey
  );
  ret.push(
    "A",
    ir * rx,
    ir * ry,
    "0",
    d.endAngle - d.startAngle > Math.PI ? 1 : 0,
    "0",
    ir * sx,
    ir * sy,
    "z"
  );
  return ret.join(" ");
}
