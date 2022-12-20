interface LoopObj {
    obj: Record<string, any>;
    objMap?: Record<string, any>;
    arrMap?: Record<string, any>;
    handleObj?: (prop: string, obj: Record<string, any>) => void;
    handleArr?: (prop: string, arr: any[]) => void;
    ts: string;
}

// 循环处理对象里的属性
function loop({ obj, objMap, arrMap, handleObj, handleArr, ts }: LoopObj) {
    for (let i in obj) {
        if (Array.isArray(obj[i])) {
            let o = [...obj[i]];
            let idx = 0;
            while (Array.isArray(o)) {
                idx++;
                // 取数组第一项作为改数组的类型定义
                o = o[0];
            }
            const a = new Array(idx).fill('[]');
            if (o) {
                ts += `\t${i}:${i.slice(0, 1).toUpperCase() + i.slice(1) + a.join('')};\n`;
                if (arrMap) {
                    arrMap[i] = obj[i];
                } else {
                    handleArr(i, obj[i]);
                }
            } else {
                // 数组第一项不存在，则默认为any数组
                ts += `\t${i}:${'any' + a.join('')};\n`;
            }
        } else {
            if (JSON.stringify(obj[i]) === '{}') {
                ts += `\t${i}:{};\n`;
            } else if (typeof obj[i] === 'object' && obj[i] !== null) {
                ts += `\t${i}:${i.slice(0, 1).toUpperCase() + i.slice(1)};\n`;
                if (objMap) {
                    objMap[i] = obj[i];
                } else {
                    handleObj(i, obj[i]);
                }
            } else {
                ts += `\t${i}:${typeof obj[i]};\n`;
            }
        }
    }
    return ts;
}


function obj2ts(obj: Record<string, any>) {
    // 存放根接口的子接口
    let otherTs = '';
    // 存放根接口
    let ts = '';

    // 处理根对象
    function handleRoot(obj: Record<string, any>, prop = 'Root') {
        ts += `interface ${prop}{\n`;
        ts = loop({ obj, handleArr, handleObj, ts });
        ts += '}\n';
        return ts;
    }

    // 处理数组
    function handleArr(prop, arr) {

        let obj = arr[0];
        while (Array.isArray(obj)) {
            obj = obj[0];
        }

        otherTs += 'interface ' + (prop.slice(0, 1).toUpperCase() + prop.slice(1) + '{\n');
        let objMap = {};
        let arrMap = {};
        otherTs = loop({ obj, objMap, arrMap, ts: otherTs });
        otherTs += '}\n';
        for (let i in arrMap) {
            handleArr(i, obj[i]);
        }
        for (let i in objMap) {
            handleObj(i, objMap[i]);
        }
    }

    // 处理对象
    function handleObj(prop, obj) {
        otherTs += 'interface ' + (prop.slice(0, 1).toUpperCase() + prop.slice(1) + '{\n');
        let objMap = {};
        let arrMap = {};
        otherTs = loop({ obj, objMap, arrMap, ts: otherTs });
        otherTs += '}\n';
        if (JSON.stringify(objMap) !== '{}') {
            for (let i in objMap) {
                handleObj(i, objMap[i]);
            }
        }
        if (JSON.stringify(arrMap) !== '{}') {
            for (let i in arrMap) {
                handleArr(i, arrMap[i]);
            }
        }
    }

    handleRoot(obj);
    return otherTs + '\n' + ts;
}

export default obj2ts;



