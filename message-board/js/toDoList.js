
let input = document.querySelector('.header').querySelector('input');
let iTemplate = document.querySelector('.doingUl').querySelector('i');
let doingCount = document.querySelector('.doing').querySelector('.doingCount');
let undoingCount = document.querySelector('.endDoing').querySelector('.doingCount');
let doingUl = document.querySelector('.doingUl');
let undoingUl = document.querySelector('.undoingUl');
let todoList = [];
localStorage.setItem("todoList", JSON.stringify(todoList));
function createDoingLi(e) {
    let inputValue = input.value;
    if (e.key == 'Enter') {
        if (inputValue != '' && inputValue != null) {
            //1.添加到本地存储
            let local = getData();
            local.push({ title: inputValue, done: false });
            //存储到本地存储
            saveData(local);

            //2.将本地存储渲染到页面
            load();
            //添加计划条目
            // let doingUl = document.querySelector('.doingUl');
            // let li = document.createElement('li');
            // li.classList.add('doingLi');
            // let inputbox = document.createElement('input');
            // inputbox.type = 'checkbox';
            // let pText = document.createElement('p');
            // let doingI = iTemplate.cloneNode(true);
            // pText.innerHTML = inputValue;
            // li.appendChild(inputbox);
            // li.appendChild(pText);
            // //删除功能
            // li.appendChild(doingI);
            // doingI.addEventListener('click', deleteI);
            // doingUl.appendChild(li);
            // //计划数字增加
            // doingCount.innerHTML++;
            // // 搜索框失去焦点
            // input.blur();
            // input.value = '';
            // finish();
            // addPlan();
        }
    }
}
function addPlan(value, index) {
    let li = document.createElement('li');
    li.classList.add('doingLi');
    li.setAttribute('index', index);
    // console.log(li.getAttribute('index'));
    li.innerHTML = `<input type="checkbox">
    <p>${value}</p>
    <i>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jianhao-"></use>
        </svg>
    </i>`
    let iNode = li.querySelector('i');
    iNode.addEventListener('click', deleteI);
    doingUl.appendChild(li);
    input.blur();
    doingCount.innerHTML = getData().length;
    input.value = '';
    finish();
}
function clearPlan() {
    let lis = doingUl.children;
    for (let j = lis.length - 1; j >= 0; --j) {
        if (!lis[j].classList.contains('hide')) {
            lis[j].remove();
        }
    }

}
//删除这项计划
function deleteI() {
    let index = this.parentNode.getAttribute('index');

    // console.log(index);
    if (this.parentNode.parentNode.classList.contains('doingUl')) {
        this.parentNode.remove();
        doingCount.innerHTML--;

    } else if (this.parentNode.parentNode.classList.contains('undoingUl')) {
        this.parentNode.remove();
        undoingCount.innerHTML--;
    }
    let data = getData();
    data.splice(index, 1);
    saveData(data);
}
//完成这项计划
function finish() {
    let liChildren = doingUl.children;
    for (let i = 0; i < liChildren.length; ++i) {
        let inputbox = liChildren[i].querySelector('input');
        inputbox.addEventListener('change', changeFinish)
    }
}
//取消完成
function unFinish() {

    let liChildren = undoingUl.children;
    for (let i = 0; i < liChildren.length; ++i) {
        let inputbox = liChildren[i].querySelector('input');
        inputbox.addEventListener('change', unchangeFinish);
    }
}
//勾选框发生变化
function changeFinish() {
    if (this.checked) {
        let liParent = this.parentNode;
        liParent.remove();
        undoingUl.appendChild(liParent);
        doingCount.innerHTML--;
        undoingCount.innerHTML++;

        unFinish();
    }
}
function unchangeFinish() {
    if (!this.checked) {
        let liParent = this.parentNode;
        liParent.remove();
        doingUl.appendChild(liParent);
        undoingCount.innerHTML--;
        doingCount.innerHTML++;
    }
}
input.addEventListener('focus', function () {
    let enterKeyUp = document.addEventListener('keyup', createDoingLi);
})
//读取本地存储的数据
function getData() {
    let data = localStorage.getItem("todoList");
    if (data != null) {
        return JSON.parse(data);
    } else {
        return [];
    }
}
//保存本地存储数据
function saveData(data) {
    localStorage.setItem("todoList", JSON.stringify(data));
}

//渲染数据
function load() {
    let data = getData();
    clearPlan();
    // for (obj of data) {
    //     console.log(obj.title);
    //     addPlan(obj.title);
    // }
    data.map(function (item, index) {
        addPlan(item.title, index);
    })
}

