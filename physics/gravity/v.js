export default {
    add(a, b) {
        return a.map((x, i) => x + b[i])
    },
    sub(a, b) {
        return a.map((x, i) => x - b[i])
    },
    mult(a, b) {
        return a.map(x => x * b);
    },
    magsq(a) {
        return a[0] * a[0] + a[1] * a[1];
    }
}