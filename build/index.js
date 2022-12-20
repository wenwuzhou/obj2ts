"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// 循环处理对象里的属性
function loop(_a) {
    var obj = _a.obj, objMap = _a.objMap, arrMap = _a.arrMap, handleObj = _a.handleObj, handleArr = _a.handleArr, ts = _a.ts;
    for (var i in obj) {
        if (Array.isArray(obj[i])) {
            var o = __spreadArray([], obj[i], true);
            var idx = 0;
            while (Array.isArray(o)) {
                idx++;
                // 取数组第一项作为改数组的类型定义
                o = o[0];
            }
            var a = new Array(idx).fill('[]');
            if (o) {
                ts += "\t".concat(i, ":").concat(i.slice(0, 1).toUpperCase() + i.slice(1) + a.join(''), ";\n");
                if (arrMap) {
                    arrMap[i] = obj[i];
                }
                else {
                    handleArr(i, obj[i]);
                }
            }
            else {
                // 数组第一项不存在，则默认为any数组
                ts += "\t".concat(i, ":").concat('any' + a.join(''), ";\n");
            }
        }
        else {
            if (JSON.stringify(obj[i]) === '{}') {
                ts += "\t".concat(i, ":{};\n");
            }
            else if (typeof obj[i] === 'object' && obj[i] !== null) {
                ts += "\t".concat(i, ":").concat(i.slice(0, 1).toUpperCase() + i.slice(1), ";\n");
                if (objMap) {
                    objMap[i] = obj[i];
                }
                else {
                    handleObj(i, obj[i]);
                }
            }
            else {
                ts += "\t".concat(i, ":").concat(typeof obj[i], ";\n");
            }
        }
    }
    return ts;
}
function obj2ts(obj) {
    // 存放根接口的子接口
    var otherTs = '';
    // 存放根接口
    var ts = '';
    // 处理根对象
    function handleRoot(obj, prop) {
        if (prop === void 0) { prop = 'Root'; }
        ts += "interface ".concat(prop, "{\n");
        ts = loop({ obj: obj, handleArr: handleArr, handleObj: handleObj, ts: ts });
        ts += '}\n';
        return ts;
    }
    // 处理数组
    function handleArr(prop, arr) {
        var obj = arr[0];
        while (Array.isArray(obj)) {
            obj = obj[0];
        }
        otherTs += 'interface ' + (prop.slice(0, 1).toUpperCase() + prop.slice(1) + '{\n');
        var objMap = {};
        var arrMap = {};
        otherTs = loop({ obj: obj, objMap: objMap, arrMap: arrMap, ts: otherTs });
        otherTs += '}\n';
        for (var i in arrMap) {
            handleArr(i, obj[i]);
        }
        for (var i in objMap) {
            handleObj(i, objMap[i]);
        }
    }
    // 处理对象
    function handleObj(prop, obj) {
        otherTs += 'interface ' + (prop.slice(0, 1).toUpperCase() + prop.slice(1) + '{\n');
        var objMap = {};
        var arrMap = {};
        otherTs = loop({ obj: obj, objMap: objMap, arrMap: arrMap, ts: otherTs });
        otherTs += '}\n';
        if (JSON.stringify(objMap) !== '{}') {
            for (var i in objMap) {
                handleObj(i, objMap[i]);
            }
        }
        if (JSON.stringify(arrMap) !== '{}') {
            for (var i in arrMap) {
                handleArr(i, arrMap[i]);
            }
        }
    }
    handleRoot(obj);
    return otherTs + '\n' + ts;
}
exports.default = obj2ts;
