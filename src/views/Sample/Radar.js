import React, { useState } from "react";
import "./Radar.css";
const Radar = (props) => {
  const diameter = props.diameter || 220;
  const radius = diameter / 2;
  const padding = 14;
  //   let ctx;
  const dToR = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  const canvasRef = React.useRef(null);
  let sweepAngle = 270;
  const sweepSize = 2;
  const sweepSpeed = 1.2;
  const rings = 4;
  const hueStart = 120;
  const hueEnd = 170;
  const hueDiff = Math.abs(hueEnd - hueStart);
  const saturation = 50;
  const lightness = 40;
  const lineWidth = 2;
  let ctx;
  let gradient;
  React.useEffect(() => {
    if (canvasRef.current && !ctx) {
      ctx = Sketch.create({
        container: canvasRef.current,
        fullscreen: false,
        width: diameter,
        height: diameter,
      });
      // ctx = canvasRef.current?.getContext("2d");
      gradient = ctx.createLinearGradient(radius, 0, 0, 0);
      gradient.addColorStop(
        0,
        "hsla( " + hueStart + ", " + saturation + "%, " + lightness + "%, 1 )"
      );
      gradient.addColorStop(
        1,
        "hsla( " + hueEnd + ", " + saturation + "%, " + lightness + "%, 0.1 )"
      );
      
      ctx.clear = () => {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "hsla( 0, 0%, 0%, 0.1 )";
        ctx.fillRect(0, 0, diameter, diameter);
      };

      ctx.update = () => {
        sweepAngle += sweepSpeed;
      };

      ctx.draw = () => {
        ctx.globalCompositeOperation = "lighter";
        renderRings();
        renderGrid();
        renderSweep();
        renderScanLines();
      };
    }
  }, [canvasRef]);

  const renderRings = () => {
    var i;
    for (i = 0; i < rings; i++) {
      ctx.beginPath();
      ctx.arc(
        radius,
        radius,
        ((radius - lineWidth / 2) / rings) * (i + 1),
        0,
        TWO_PI,
        false
      );
      ctx.strokeStyle =
        "hsla(" +
        (hueEnd - i * (hueDiff / rings)) +
        ", " +
        saturation +
        "%, " +
        lightness +
        "%, 0.1)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  var renderGrid = () => {
    ctx.beginPath();
    ctx.moveTo(radius - lineWidth / 2, lineWidth);
    ctx.lineTo(radius - lineWidth / 2, diameter - lineWidth);
    ctx.moveTo(lineWidth, radius - lineWidth / 2);
    ctx.lineTo(diameter - lineWidth, radius - lineWidth / 2);
    ctx.strokeStyle =
      "hsla( " +
      (hueStart + hueEnd) / 2 +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%, .03 )";
    ctx.stroke();
  };

  var renderSweep = () => {
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(dToR(sweepAngle));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, dToR(-sweepSize), dToR(sweepSize), false);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  };

  var renderScanLines = () => {
    var i;
    var j;
    ctx.beginPath();
    for (i = 0; i < diameter; i += 2) {
      ctx.moveTo(0, i + 0.5);
      ctx.lineTo(diameter, i + 0.5);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "hsla( 0, 0%, 0%, .02 )";
    ctx.globalCompositeOperation = "source-over";
    ctx.stroke();
  };

  return <div id="radar" ref={canvasRef}></div>;
};

export default Radar;
