class Plan {
    constructor(description, index, done) {
        this.description = description;
        this.index = index;
        this.done = done;
    }
}
class UI {
    static num = 0;
    //获取input值，从而创建plan对象
    createPlan(e) {
        const inputValue = document.querySelector('.header').querySelector('input').value;
        if (e.key == 'Enter') {
            if (inputValue != '' && inputValue != null) {
                let plan = new Plan(inputValue, UI.num++, false);
                Store.savePlan(plan);
                Store.loadPlan();
            }
        }
    }
    //点击关闭图标，从而删除plan对象
    removePlan() {
        let liParent = this.parentNode;
        const plan = JSON.parse(liParent.getAttribute('planObject'));
        Store.deletePlan(plan);
        Store.loadPlan();
    }

    //渲染之前先清空计划条目
    clearPlan() {
        document.querySelector('.doingUl').innerHTML = '';
        document.querySelector('.undoingUl').innerHTML = '';
    }
    //将计划添加到正在进行
    addUnfinishPlan(plan) {
        let li = document.createElement('li');
        li.classList.add('doingLi');
        //为了能够在删除时找到该对象
        li.setAttribute('planObject', JSON.stringify(plan));
        li.innerHTML = `<input type="checkbox" id=""> 
        <p>${plan.description}</p>
        <i>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jianhao-"></use>
            </svg>
        </i>`
        document.querySelector('.doingUl').appendChild(li);
    }
    //将计划添加到已经完成
    addFinishPlan(plan) {
        let li = document.createElement('li');
        li.classList.add('doingLi');
        //为了能够在删除时找到该对象
        li.setAttribute('planObject', JSON.stringify(plan));

        li.innerHTML = `<input type="checkbox" checked="checked" id="">
        <p>${plan.description}</p>
        <i>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jianhao-"></use>
            </svg>
        </i>`
        document.querySelector('.undoingUl').appendChild(li);
    }
    //将计划从未完成变为完成或从未完成变为完成
    togglePlan() {
        let liParent = this.parentNode;
        let plan = JSON.parse(liParent.getAttribute('planObject'));
        let done_or_not = plan.done;
        if (this.checked == "true") {
            Store.deletePlan(plan);
            plan.done = !done_or_not;
            Store.savePlan(plan);
        } else {
            Store.deletePlan(plan)
            plan.done = !done_or_not;
            Store.savePlan(plan);
        }
        Store.loadPlan();
    }
    //修改计划的数量
    modifyCount(arr) {
        document.querySelector('.doing').querySelector('.doingCount').innerHTML = arr[1];
        document.querySelector('.endDoing').querySelector('.doingCount').innerHTML = arr[0];
    }
    //获得现有的所有li，为其添加关闭和转换功能
    addButtonFunction() {
        const lis1 = document.querySelector('.doingUl').children;
        const lis2 = document.querySelector('.undoingUl').children;
        for (let i = 0; i < lis1.length; ++i) {
            lis1[i].querySelector('i').addEventListener('click', this.removePlan);
            lis1[i].querySelector('input').addEventListener('change', this.togglePlan);
        }
        for (let i = 0; i < lis2.length; ++i) {
            lis2[i].querySelector('i').addEventListener('click', this.removePlan);
            lis2[i].querySelector('input').addEventListener('change', this.togglePlan);
        }
    }
}
// localStorage中值的格式为key:todoList value:[{description:xxx,done:flase},]
class Store {
    /* 
        JSON.parse()用于从一个字符串中解析出json对象
        JSON.stringify用于从一个对象解析出字符串
    */
    //从本地存储中获取todoList
    static getPlan() {
        let plans;
        if ((plans = localStorage.getItem('todoList')) === null || localStorage.getItem('todoList') == []) {
            plans = [];
        } else {
            //[Object object]
            plans = JSON.parse(localStorage.getItem('todoList'));
            // console.log(plans); 
        }
        return plans;
    }
    //存储计划到本地存储
    static savePlan(plan) {
        let plans = Store.getPlan();
        plans.push(plan);
        localStorage.setItem('todoList', JSON.stringify(plans));
    }
    //删除本地存储的计划
    static deletePlan(plan) {
        let plans = Store.getPlan();
        plans.forEach(function (subplan, i) {
            if (plan.index == subplan.index) {
                plans.splice(i, 1);
            }
        });
        localStorage.setItem('todoList', JSON.stringify(plans));
    }
    //辅助函数，返回已完成计划数量和未完成计划数量的数组
    static planLength() {
        let undoLength = 0;
        let doLength = 0;
        const plans = Store.getPlan();
        plans.forEach(function (plan) {
            if (plan.done) {
                doLength++;
            } else {
                undoLength++;
            }
        });
        return [doLength, undoLength];
    }
    //渲染页面
    static loadPlan() {
        const ui = new UI();
        const plans = Store.getPlan();
        const lengthArr = Store.planLength();
        //渲染前先清空
        ui.clearPlan();
        plans.forEach(function (plan) {
            if (plan.done) {
                ui.addFinishPlan(plan);
            } else {
                ui.addUnfinishPlan(plan);
            }
        });
        ui.modifyCount(lengthArr);
        ui.addButtonFunction();
    }
}
document.addEventListener('DOMContentLoaded', Store.loadPlan);
const ui = new UI();
document.querySelector('.header').querySelector('input')
    .addEventListener('focus', function () {
        document.addEventListener('keyup', ui.createPlan);
    })