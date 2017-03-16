function track(path, layer, parents) {
    if (layer == undefined) layer = -1;
    if (layer == 0) return [];
    if (parents == undefined) parents = [];
    if (typeof path == "string") {
        var value = null;
        try {
            value = eval(path);
        }catch(e){
            return [];
        }
        var trackers = [];
        if (value instanceof Object) {
            if(value instanceof Node) return [];
            if(value.toString().includes("native code")) return [];
            if (parents.includes(value)) return [];
            if(value.length>1000);
            else for (var i in value) trackers = trackers.concat(track(path + "['" + i + "']", layer - 1, parents.concat(value)));
        }
        var tracker = {
            path: path,
            get pointer() {
                return eval(path);
            },
            set pointer(v) {
                eval(path + '=' + JSON.stringify(v));
            },
            value: value,
            lastValue: value
        };
        tracker.update = function () {
            tracker.lastValue = tracker.value;
            tracker.value = tracker.pointer;
        };
        trackers.push(tracker);
        return trackers;
    }
}