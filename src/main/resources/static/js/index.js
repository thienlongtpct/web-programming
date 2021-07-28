// const valid = (text) => {
//     let lines = text.split('\n');
//     return lines.filter(line => line.trim().split(' ').length > 3).length === 0;
//     return true;
// }

window.onload = () => {
    // input.on('change', () => {
    //     input.operation(() => {
    //         let lines = input.getValue().split('\n');
    //         lines.forEach((line, index) => {
    //             if (line.trim().split(' ').length > 3) {
    //                 let msg = document.createElement("div");
    //                 let icon = msg.appendChild(document.createElement("span"));
    //                 icon.innerHTML = "!";
    //                 icon.className = "lint-error-icon";
    //                 msg.appendChild(document.createTextNode('The input must be between 2 and 3'));
    //                 msg.className = "lint-error";
    //                 input.addLineWidget(index, msg, {coverGutter: false, noHScroll: true});
    //             } else {
    //             }
    //         });
    //     });
    // let info = input.getScrollInfo();
    // let after = input.charCoords({line: input.getCursor().line + 1, ch: 0}, "local").top;
    // if (info.top + info.clientHeight < after)
    //     input.scrollTo(null, after - info.clientHeight + 3);
    // })

    //init board
    let board = JXG.JSXGraph.initBoard('box1',{
        axis: true,
        boundingbox: [-5.25, 5.25, 5.25, -5.25]
    });

    //sliders
    let r = board.create('slider', [[1, 3], [3, 3], [1, 3, 3]], {name: 'R', snapWidth: 0.5});
    let R = () => r.Value();
    let minusR = () => -r.Value();
    let halfR = () => r.Value()/2;

    const addPoint = async (x, y, r, label) => await fetch('http://localhost:8080/api/add?x=' + x + '&y=' + y + '&r=' + r, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                alert('Server is not connected!');
            }
        })
        .then(result => {
            if (label !== '') {
                board.create('point', [x, y], {
                    color: result ? 'green' : 'red',
                    id: label
                });
            }
            else {
                board.create('point', [x, y], {
                    color: result ? 'green' : 'red',
                    label: {visible: false}
                });
            }
        })
        .catch(error => {
            alert(error);
        });

    const getXY = (e, i) => {
        let currentPos = board.getCoordsTopLeftCorner(e, i),
            absolutePos = JXG.getPosition(e, i),
            dx = absolutePos[0] - currentPos[0],
            dy = absolutePos[1] - currentPos[1];

        let jxgCoordinate = new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
        let x = jxgCoordinate.usrCoords[1];
        let y = jxgCoordinate.usrCoords[2];

        return {x, y};
    }

    let current = CodeMirror.fromTextArea(document.getElementById('current'), {
        lineNumbers: true,
        styleActiveSelected: true,
        mode: 'text',
        readOnly: true
    })
    current.setSize(null, 30);
    current.setValue('(0, 0)');

    let input = CodeMirror.fromTextArea(document.getElementById('input'), {
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        styleActiveSelected: true,
        mode: 'text'
    })
    input.setSize(null, 300);
    input.setValue('');
    input.on('keyup', (e, i) => {
        if (i.code === 'Enter') {
            let lineIndex = input.getCursor().line-1;
            let content = input.getValue().split('\n')[lineIndex].trim().split(' ');
            addPoint(content[0], content[1], r.Value(), content[2]);
        }
    });

    // first corner (triangle)
    board.create('polygon', [[0,0], [0, halfR], [R,0]],{
        fillColor : '#e74c3c',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    });

    //second corner (square)
    board.create('polygon', [[0,0], [R,0], [R, minusR], [0, minusR]],{
        fillColor : '#3498db',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    });

    //quarter corner (quarter circle)
    let quarterCircle = X => Math.sqrt((r.Value() - X) * (r.Value() + X));
    board.create('functiongraph', [quarterCircle, minusR, 0], {
        fillColor: '#16a085',
        fillOpacity: 0.3,
        strokeColor: 'none',
        highlight: false,
        withLines: false,
        vertices: {visible: false}
    });

    board.create('polygon', [[0, 0], [minusR, 0], [0, R]],{
        fillColor: '#16a085',
        strokeColor: 'none',
        withLines: false,
        vertices: {visible: false}
    })

    document.getElementById('box1').addEventListener('mousemove', (e, i) => {
        let {x, y} = getXY(e, i);
        current.setValue('(' + x.toFixed(2) + ', ' + y.toFixed(2) + ')');
    });

    document.getElementById('box1').addEventListener('mousedown', (e,i) => {
        let {x, y} = getXY(e, i);
        addPoint(x, y, r.Value(), '');
    });

    let advancedInput = document.getElementById('advanced');
    let simpleInput = document.getElementById('simple');

    let advanceContent = document.getElementById('advanced-content');
    let simpleContent = document.getElementById('simple-content')

    advancedInput.addEventListener('click', () => {
        if (!advancedInput.classList.contains('checked')) {
            advancedInput.classList.toggle('checked');
            simpleInput.classList.toggle('checked');
            advanceContent.style.display = 'block';
            simpleContent.style.display ='none';
        }
    })

    simpleInput.addEventListener('click', () => {
        if (!simpleInput.classList.contains('checked')) {
            advancedInput.classList.toggle('checked');
            simpleInput.classList.toggle('checked');
            advanceContent.style.display = 'none';
            simpleContent.style.display ='block';
        }
    })

    let viewModeInput = document.getElementById('view mode');
    let selectModeInput = document.getElementById('select mode');
    let deleteModeInput = document.getElementById('delete mode');


    viewModeInput.addEventListener('click', () => {
        if(!viewModeInput.classList.contains('checked')){
            viewModeInput.classList.toggle('checked');
        }
        if(selectModeInput.classList.contains('checked')){
            selectModeInput.classList.toggle('checked');
        }
        if(deleteModeInput.classList.contains('checked')){
            deleteModeInput.classList.toggle('checked');
        }
    })

    selectModeInput.addEventListener('click', () => {
        if(viewModeInput.classList.contains('checked')){
            viewModeInput.classList.toggle('checked');
        }
        if(!selectModeInput.classList.contains('checked')){
            selectModeInput.classList.toggle('checked');
        }
        if(deleteModeInput.classList.contains('checked')){
            deleteModeInput.classList.toggle('checked');
        }
    })

    deleteModeInput.addEventListener('click', () => {
        if(viewModeInput.classList.contains('checked')){
            viewModeInput.classList.toggle('checked');
        }
        if(selectModeInput.classList.contains('checked')){
            selectModeInput.classList.toggle('checked');
        }
        if(!deleteModeInput.classList.contains('checked')){
            deleteModeInput.classList.toggle('checked');
        }
    })

    let overviewInput = document.getElementById('overview');
    let instructionInput = document.getElementById('instruction');
    let notationInput = document.getElementById('notation');

    let overviewContent = document.getElementById('overviewContent');
    let instructionContent = document.getElementById('instructionContent');
    let notationContent = document.getElementById('notationContent');

    overviewInput.addEventListener('click', () => {
        if(!overviewInput.classList.contains('checked')){
            overviewInput.classList.toggle('checked');
            overviewContent.style.display = 'block';
        }
        if(instructionInput.classList.contains('checked')){
            instructionInput.classList.toggle('checked');
            instructionContent.style.display = 'none';

        }
        if(notationInput.classList.contains('checked')){
            notationInput.classList.toggle('checked');
            notationContent.style.display = 'none';

        }

    })

    instructionInput.addEventListener('click', () => {
        if(overviewInput.classList.contains('checked')){
            overviewInput.classList.toggle('checked');
            overviewContent.style.display = 'none';
        }
        if(!instructionInput.classList.contains('checked')){
            instructionInput.classList.toggle('checked');
            instructionContent.style.display = 'block';

        }
        if(notationInput.classList.contains('checked')){
            notationInput.classList.toggle('checked');
            notationContent.style.display = 'none';
        }
    })

    notationInput.addEventListener('click', () => {
        if(overviewInput.classList.contains('checked')){
            overviewInput.classList.toggle('checked');
            overviewContent.style.display = 'none';

        }
        if(instructionInput.classList.contains('checked')){
            instructionInput.classList.toggle('checked');
            instructionContent.style.display = 'none';

        }
        if(!notationInput.classList.contains('checked')){
            notationInput.classList.toggle('checked');
            notationContent.style.display = 'block';
        }
    })

    document.getElementById('submit-button').addEventListener('click', () => {

        let xValueList = document.getElementsByName('x_value');
        let yValue = document.getElementById('y_value');
        let rValueList = document.getElementsByName('r_value');

        if(yValue.value === "" || +yValue.value < -5.0 || +yValue.value > 5.0){
            alert('Please enter Y with value from -5.0 to 5.0');
        }

        let y = yValue.value;
        let x;
        let r;

        for(let i = 0; i < xValueList.length; i++){
            if(xValueList[i].checked){
                x = xValueList[i].value;
            }
        }

        for(let i = 0; i < rValueList.length; i++){
            if(rValueList[i].checked){
                r = rValueList[i].value;
            }
        }

        console.log(x);
        console.log(y);
        console.log(r);


        addPoint(x, y, r);
    })
}