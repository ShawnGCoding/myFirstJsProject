let inputNameBox = document.querySelector('.personName');
// console.log(inputNameBox);
let btn = document.querySelector('.btn');
// console.log(btn);
let content = document.querySelector('.content');
// console.log(content);
let board = document.querySelector('.board');
let warning = document.querySelector('.warning');
let count = 1;
function addBoard(nameValue, contentValue, board) {
    let createDiv = document.createElement('div');
    let innerH = `<div class="boardTitle">
                        第${count++}楼  ${nameValue}:
                </div>
                <p class="boardContent">${contentValue}<button class="boardDelete">删除</button></p>`;
    createDiv.innerHTML = innerH;
    board.appendChild(createDiv);
    let boardDelete = createDiv.querySelector('.boardDelete');
    boardDelete.addEventListener('click', function () {
        this.parentElement.parentElement.remove();
    })


}
btn.addEventListener('click', function () {
    let nameValue = inputNameBox.value;
    let contentValue = content.value;
    if (nameValue == "" || nameValue == null) {
        warning.classList.remove("hide");
    } else {
        warning.classList.add("hide");
        addBoard(nameValue, contentValue, board);
        inputNameBox.value = "";
        content.value = "";
    }

});
