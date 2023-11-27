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

var TableData = /** @class */ (function (_super) {
    function TableData() {
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
    return TableData;
}(Lookup));

exports.TableData = TableData;
exports.TableData = new TableData();


var TableData01 = /** @class */ (function (_super) {
    function TableData01() {
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
    return TableData01;
}(Lookup));

exports.TableData01 = TableData01;
exports.TableData01 = new TableData01();
function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180) || 0;
}
exports.degreesToRadians = degreesToRadians;

