var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.degreesToRadians = exports.Table223 = exports.Table_223 = exports.Table22 = exports.Table_22 = exports.RiskType = void 0;
exports.RiskType = {
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
};
var Lookup = /** @class */ (function () {
    function Lookup() {
        this.data = [];
        this.quartile = 90;
        this.keyData = [
            'type',
            'projNum',
            'angle',
            'xpos',
            'ypos'
        ];
    }
    Lookup.prototype.getData = function () {
        return this.data;
    };
    Lookup.prototype.vLookup = function (value, index) {
        var element = this.data.find(function (item) { return item.type === value; });
        if (element) {
            return element[this.keyData[index - 1]];
        }
        return 0;
    };
    return Lookup;
}());
var Table_22 = /** @class */ (function (_super) {
    __extends(Table_22, _super);
    function Table_22() {
        var _this = _super.call(this) || this;
        _this.data = [
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
        _this.data = _this.data.map(function (item) {
            return __assign(__assign({}, item), { angle: degreesToRadians(_this.quartile / item.projNum) });
        });
        return _this;
    }
    return Table_22;
}(Lookup));
exports.Table_22 = Table_22;
exports.Table22 = new Table_22();
var Table_223 = /** @class */ (function (_super) {
    __extends(Table_223, _super);
    function Table_223() {
        var _this = _super.call(this) || this;
        _this.data = [
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
        _this.data = _this.data.map(function (item) {
            return __assign(__assign({}, item), { angle: degreesToRadians(_this.quartile / item.projNum) });
        });
        return _this;
    }
    return Table_223;
}(Lookup));
exports.Table_223 = Table_223;
exports.Table223 = new Table_223();
function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180) || 0;
}
exports.degreesToRadians = degreesToRadians;
