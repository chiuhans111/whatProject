<template>
    <span v-html="content">
    </span>
</template>
<script>
    import katex from "./katex.min.js";
    import "./katex.min.css";

    export default {
        props: ["expr"],
        data() {
            return { script: "" };
        },
        computed: {
            content() {
                return katex.renderToString(this.expr)
            }
        }
    };
</script>