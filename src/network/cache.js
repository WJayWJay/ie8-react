

const obj = {};

export default {
    get: (key, val = null) => {
        if (!key) return val;
        if (obj[key]) {
            return obj[key];
        } else {
            let lval = localStorage.getItem(key);
            if (lval) {
                try {
                    lval = JSON.parse(lval);
                    return lval;
                } catch(e) {

                }
                return lval;
            } else {
                return val;
            }
        }
    },
    set: (key, val) => {
        if (!key || !val) {
            return false;
        }
        obj[key] = val;
        if (localStorage) {
            try {
                localStorage.setItem(key, JSON.stringify(val));
            } catch (e) {

            }
        }
    }
}