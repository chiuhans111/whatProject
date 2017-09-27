<template>
    <div>
        <p>
            test
        </p>
        <h1>
            {{message}}
        </h1>
    </div>
</template>

<script>

export default {
    data() {
        return {
            message: 'hello world',
        }
    }
}
</script>

<style>
h1 {
    font-size: 2em
}
</style>
