import dayjs from 'dayjs';

import areaData from '@/constant/data';

const china = areaData['86'];

export function timeFormat(val, format = 'YYYY/MM/DD') {
    let v = +val;
    if (isNaN(v)) return val;
    return dayjs(v).format(format);
}

export function areaFormat(val) {
    if (val && val.includes('-')) {
        let areaArr = val.split('-');
        let len = areaArr.length;
        if (len === 3) {
            return china[areaArr[0]] + areaData[areaArr[0]][areaArr[1]] + areaData[areaArr[1]][areaArr[2]];
        } else {
            return china[areaArr[0]] + areaData[areaArr[0]][areaArr[1]];
        }
    }
    return val;
}