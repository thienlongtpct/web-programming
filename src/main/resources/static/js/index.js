// window.onload = () => {
//     let canvas = document.getElementById('canvas');
//     canvas.width = 650;
//     canvas.height = 650;
//
//     let context = canvas.getContext('2d');
//     let image = new Image();
//     image.onload = () => context.drawImage(image, 0, 0, 650, 650);
//     image.src = '../images/areas.png';
//
//     const getPosition = (event) => {
//         let bound = canvas.getBoundingClientRect();
//         let R = 250;
//         let x = (event.clientX - bound.left - canvas.clientLeft - canvas.width / 2) / R;
//         let y = -(event.clientY - bound.top - canvas.clientTop - canvas.height / 2) / R;
//         return {x, y};
//     }
//
//     canvas.addEventListener('mousemove', event => {
//         let current = document.getElementById('current');
//         let {x, y} = getPosition(event);
//         current.innerText = 'Current Point: (' + (Math.round(x * 100) / 100).toFixed(2) + 'R, ' + (Math.round(y * 100) / 100).toFixed(2) + 'R)';
//     });
//
//     canvas.addEventListener('click', event => {
//         let selected = document.getElementById('selected');
//         let newSelected = document.createElement('li');
//         let {x, y} = getPosition(event);
//
//         let bound = canvas.getBoundingClientRect();
//
//         let url = "http://localhost:8080/api/checkInside?x=" + x.toString() + '&y=' + y.toString();
//         fetch(url)
//             .then(response => {
//                 if (response.status === 200) return response.json();
//                 return new Error(response.statusText);
//             })
//             .then(result => {
//                 newSelected.innerHTML =
//                     '(' + (Math.round(x * 100) / 100).toFixed(2) + 'R, ' + (Math.round(y * 100) / 100).toFixed(2) + 'R): ' +
//                     (result ? '<span style="color: green">inside</span>' : '<span style="color: red">outside</span>');
//
//                 if (result) {
//                     let plus = new Image();
//                     plus.onload = () => context.drawImage(plus, event.clientX - bound.left - canvas.clientLeft - 10, event.clientY - bound.top - canvas.clientTop - 10, 20, 20);
//                     plus.src = '../images/plus.png';
//                 } else {
//                     let cross = new Image();
//                     cross.onload = () => context.drawImage(cross, event.clientX - bound.left - canvas.clientLeft - 10, event.clientY - bound.top - canvas.clientTop - 10, 20, 20);
//                     cross.src = '../images/cross.png';
//                 }
//
//                 selected.appendChild(newSelected);
//             })
//             .catch(error => {
//                 alert(error);
//             })
//
//     });
// }