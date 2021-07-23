window.onload = () => {
    //init board and slider
    let board = JXG.JSXGraph.initBoard('box1', {
        axis: true,
        boundingbox: [-5.25, 5.25, 5.25, -5.25]
    });
    let r = board.create('slider', [[1, 3], [3, 3], [1, 3, 3]], {name:'R', snapWidth: 0.5});

    //function generate value
    let R = () => r.Value();
    let halfR = () => r.Value()/2;
    let minusR = () => -r.Value();

    //first corner (triangle)
    board.create('polygon', [[0, 0], [0, halfR], [R, 0]], {
        fillColor: '#e74c3c',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    });

    //second corner (square)
    board.create('polygon', [[0, 0], [R, 0], [R, minusR], [0, minusR]], {
        fillColor: '#3498db',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    });

    //fourth corner (quarter circle)
    let quarterCircle = X => Math.sqrt((r.Value()-X)*(r.Value()+X));
    board.create('functiongraph', [quarterCircle, minusR,  0], {
        fillColor: '#16a085',
        fillOpacity: 0.3,
        strokeColor: 'none',
        highlight: false,
        withLines: false,
        vertices: {visible: false}
    });
    board.create('polygon', [[minusR, 0], [0, 0], [0, R]], {
        fillColor: '#16a085',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    });

    document.getElementById('box1').addEventListener('mousemove', (e, i) => {
        let currentPos = board.getCoordsTopLeftCorner(e, i),
            absolutePos = JXG.getPosition(e, i),
            dx = absolutePos[0]-currentPos[0],
            dy = absolutePos[1]-currentPos[1];

        let jxgCoordinate = new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
        let x = jxgCoordinate.usrCoords[1];
        let y = jxgCoordinate.usrCoords[2];
    });
}