export class BubbleData {
  type: number;
  subCategory: number;
  probability: number;
  impact: number;
  total: number;
  radian: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const RiskType = {
  'Technology': [
      'Infrastructure Capacity',
      'Aging Equipment',
      'SPOF / Resilience',
      'Aging Apps / OS',
      'Monitoring',
      'Environmental',
      'Disaster Recovery'
  ],
  'Process': [
      'Process & Standards',
      'Key Person Dependency',
      'People Capacity',
      'Project Deployment',
      'Supplier Management'
  ],
  'Data': [
      'Logical Access',
      'Physical Access',
      'Data',
      'Vulnerabilities'
  ],
  'Asset': [
      'Licensing',
      'Loss of IT asset'
  ]
}

class Lookup {
  data: any[];
  quartile = 90;

  keyData = [
    'type',
    'projNum',
    'angle',
    'xpos',
    'ypos'
  ]

  getData() {
    return this.data;
  }

  vLookup(value, index): number {
    const element = this.data.find((item) => item.type === value);
    if (element) {
      return element[this.keyData[index - 1]];
    }

    return 0;
  }
}

export class Table_22 extends Lookup {
  data = [
    {
      type: "Asset",
      projNum: 3,
      xpos: 1,
      ypos: 1,
    },
    {
      type: "Process",
      projNum: 6,
      xpos: -1,
      ypos: 1,
    },
    {
      type: "Data",
      projNum: 5,
      xpos: -1,
      ypos: -1,
    },
    {
      type: "Technology",
      projNum: 8,
      xpos: 1,
      ypos: -1,
    },
  ];

  constructor() {
    super();
    this.data = this.data.map((item) => {
      return {
        ...item,
        angle: degreesToRadians(this.quartile / item.projNum),
      };
    });
  }
}

export const Table22 = new Table_22();

export class Table_223 extends Lookup {
  data = [
    {
      type: "Asset",
      projNum: 3.8,
      xpos: 1,
      ypos: 1,
    },
    {
      type: "Process",
      projNum: 6.1,
      xpos: -1,
      ypos: 1,
    },
    {
      type: "Data",
      projNum: 10.2,
      xpos: -1,
      ypos: -1,
    },
    {
      type: "Technology",
      projNum: 27.9,
      xpos: 1,
      ypos: -1,
    },
  ];

  constructor() {
    super();
    this.data = this.data.map((item) => {
      return {
        ...item,
        angle: degreesToRadians(this.quartile / item.projNum),
      };
    });
  }
}

export const Table223 = new Table_223();

export function degreesToRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180) || 0;
}
