<template>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>
<script>
    import Graph from "./entry";

    export default {
        props: ["width", "height", "data"],
        data() {
            return {
                graph: new Graph(this.$refs.canvas)
            };
        },
        methods: {
            plot() {
                this.graph.plot(this.data);
            }
        },
        watch: {
            data() {
                this.plot();
            }
        },
        mounted() {
            this.plot();
        }
    };
</script>