var sampleTensorPackage = {
    variables: {
        w: [1, 1, 1, 1, 1],
        b: [1, 1, 1, 1, 1],
    },
    placeholders: {
        x,
    },
    functions: {
        output: ['add', ['mult', 'x', 'w'], 'b'],
    },
    data: {
        y_true: [
            [[1, 2, 3, 4, 5], 1],
            [[5, 4, 3, 2, 1], 0],
        ]
    }

}