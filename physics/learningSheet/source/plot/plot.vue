<template>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>
<script>
    import Plot from './entry';

    export default {
        props: ['width', 'height', 'data'],
        data() {
            return {

            }
        },
        methods: {
            plot() {
                Plot(this.$refs.canvas, this.data)
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
    }

</script>