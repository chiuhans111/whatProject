module.exports = [...Array(20)].map(line => {
    return [...Array(40)].map(data => {
        return Math.random() > 0.5 ? '.' : ' ';
    })
})