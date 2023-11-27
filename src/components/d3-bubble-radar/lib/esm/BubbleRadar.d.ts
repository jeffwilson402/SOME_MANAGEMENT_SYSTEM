import React from "react";
import * as d3 from "d3";
import { MainType, DimensionsType } from "./index.interface";
import "./App.css";
export interface Props {
    data: MainType[];
    dimensions?: DimensionsType;
}
export interface State {
    width: number;
    height: number;
    data: MainType[];
}
export default class BubbleRadar extends React.Component<Props, State> {
    static defaultProps: {
        dimensions: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            width: number;
            height: number;
        };
    };
    svgRef: React.RefObject<SVGSVGElement>;
    totalSize: number;
    radius: number;
    unit: d3.ScaleLinear<number, number, never>;
    table22: import("./Lookup").Table_22;
    color: d3.ScaleLinear<string, string, never>;
    scaleRadius: d3.ScaleLinear<number, number, never>;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
    shouldComponentUpdate(nextProps: Props): boolean;
    compareObject(x: MainType[], y: MainType[]): boolean;
    cloneObject(data: MainType[]): MainType[];
    drawBubble(svgEl: d3.Selection<SVGSVGElement | null, unknown, null, undefined>): void;
    drawRing(svgEl: d3.Selection<SVGSVGElement | null, unknown, null, undefined>): void;
    render(): JSX.Element;
}
