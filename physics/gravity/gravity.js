import v from 'v';

var dt = 50000;

var planets = [];

function setup() {
    while (planets.length) planets.pop();
    for (var i = 0; i < 6; i++) {
        planets.push(new planet(
            Math.random() * 400 + 50,
            Math.random() * 500 - 250,
            Math.random() * 40 - 5,
            Math.random() * 1000 - 500,
            Math.random() * 40 + 10,
            Math.random() * 10 + 5,
        ))
    }

    planets.push(new planet(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 + 200,
        Math.random() * 10 + 30,
    ));

    var s = [0, 0];
    var m = 0;
    for (var i of planets) {
        s = v.add(s, v.mult(i.v, i.m));
        m += i.m;
    }
    s = v.mult(s, 1 / m);
    for (var i of planets) {
        i.v[0] -= s[0];
        i.v[1] -= s[1];
    }
}

// default scene
planets.push(new planet(
    0, 0,
    0, 0,
    500,
    50
))

planets.push(new planet(
    250, 0,
    0, 160,
    10,
    10
))

planets.push(new planet(
    -250, 0,
    0, -160,
    10,
    10
))

planets.push(new planet(
    300, 20,
    0, -10,
    2,
    5
))

planets.push(new planet(
    -300, -20,
    0, 10,
    2,
    5
))

function planet(x, y, vx, vy, mass, size) {
    var me = this;
    this.p = [x, y];
    this.v = [vx, vy];
    this.a = [0, 0];
    this.f = [0, 0];
    this.m = size;
    this.s = size;
    this.apply = function () {
        me.a = v.mult(me.f, 1 / me.m);
        me.p = v.add(me.p, v.mult(me.v, 1 / dt));
        me.v = v.add(me.v, v.mult(me.a, 1 / dt));
        me.f = [0, 0];
    }
}

var g = 100000;

function gravity(p1, p2, min = 0) {
    var d = v.sub(p1, p2);
    var dd = v.magsq(d);
    if (dd < 0.0001) dd = 0.0001;
    var f = g / dd;
    if (dd < min * min) f = -(min - Math.sqrt(dd)) * g;
    var ddd = f / Math.sqrt(dd);
    var fx = d[0] * ddd;
    var fy = d[1] * ddd;
    return [fx, fy];
}

function gravityMap(x, y, planets) {
    var f = [0, 0];
    for (var i of planets) {
        f = v.add(f, v.mult(gravity(i.p, [x, y]), i.m));
    }
    return f;
}

function simulate(planets) {
    for (var t = 0; t < dt / 48; t++) {

        for (var i = 0; i < planets.length - 1; i++) {
            for (var j = i + 1; j < planets.length; j++) {
                var p1 = planets[i];
                var p2 = planets[j];
                var gg = v.mult(gravity(p1.p, p2.p, (p1.s + p2.s) / 2), p1.m * p2.m);

                p2.f = v.add(p2.f, gg);
                p1.f = v.sub(p1.f, gg);
            }
        }

        for (var i = 0; i < planets.length; i++) planets[i].apply();
    }
}

export default {
    setup,
    planet,
    planets,
    gravityMap,
    simulate
}