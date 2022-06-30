// todo : lý thuyết 
// ? Nên sử dụng dataset để select element hơn là class. 
// * 1. Tách biệt code javascript với css (khi css thay đổi không cần phải thay đổi từ file javscript)
// * 2. dataset có thể truyền tải thông tin tốt hơn
// * ví dụ : Sử dụng 2 class success và error để đánh dấu trạng thái đó. -> Đây là 1 ý tưởng tồi. Bởi bì muốn đánh dấu trạng thái success thì phải xóa đi trạng class error trước đó. Thay vào đó ta sử dụng dataset có thể rõ ràng hơn, gắn liền với javascript hơn 

// ! Nên sử dụng dataset nếu liên quan đến javscript

// * tag template được sử dụng khi có 1 đoạn mã html sử dụng ở nhiều nơi. template không được hiển thị trên trình duyệt. muốn sử dụng template để hiển thị lên trang web chỉ có thể sử dụng javasctipt 
// * method content khá giống với method children, Nhưng content return về cả comment trong tag


// * Nên tạo ra các element hơn là sử dụng innerHTML.
// * Sử dụng innerHTML trang web sẽ phân tích lại DOM của element đó
// * Khi tạo ra phần tử trình duyệt không phân tích lại DOM mà chi gắn element đó vào DOM 
// * Sử dụng innerHTML trong trường hợp nguồn html được chèn vào đáng tin cậy. hacker có thể lợi dụng chèn mã độc vào mã  

// * khi bạn append nhiều lần, Việc này khiến trình duyệt load nhiều lần, nên sử dụng DocumentFragment để trình duyệt chỉ load 1 lần. 

// * Sử dụng DocumentFragment để soạn các nút DOM trước khi cập nhật chúng vào cây DOM đang hoạt động để có được hiệu suất tốt hơn.


// todo : function 
// * 1.Thêm list 
// * 2. Hiển thị task 
// * 3. Xóa list đang select 
// * 4. Xóa toàn task đã làm song 
// * 5. Nghiên cứu thêm tính năng sữa và xóa các task/list riêng lẽ 


// todo : SELECT 

const formAddList = document.querySelector('[data-new-list-form]')
const inputAddList = document.querySelector('[data-new-list-input]')
const containerList = document.querySelector('[data-wrap-list]')
const containerTask = document.querySelector('[data-display-task]')
const showTitleList = document.querySelector('[data-title-list]')
const showTotalNotComplete = document.querySelector('[data-total-not-complete]')
const formAddTask = document.querySelector('[data-new-task-form]')
const inputAddTask = document.querySelector('[data-new-task-input]')
const showTasks = document.querySelector('[data-wrap-task]')
const btnDeleteTask = document.querySelector('[data-delete-task]')
const btnDeleteList = document.querySelector('[data-delete-list]')


const KEY_LISTS_LOCAL_STORAGE = 'lists'
const KEY_LIST_ID_CURENT_LOCAL_STORAGE = 'idCurentList'


const templateCheckbox = document.querySelector('[data-template-checkbox]')

let lists = JSON.parse(localStorage.getItem(KEY_LISTS_LOCAL_STORAGE)) || []

let idCurentList = JSON.parse(localStorage.getItem(KEY_LIST_ID_CURENT_LOCAL_STORAGE))

renderList()
renderTask()

// todo : EVENT 


formAddList.addEventListener('submit', event => {
    event.preventDefault()
    const nameList = inputAddList.value
    if (nameList) {
        let objNewList = createList(nameList)
        lists.push(objNewList)
        save()
        inputAddList.value = null
        renderList()
    }
})

formAddTask.addEventListener('submit', event => {
    event.preventDefault()
    const taskName = inputAddTask.value
    if (taskName) {
        let objNewTask = createTask(taskName)
        let curentList = lists.find(list => list.listId === idCurentList)
        curentList.tasks.push(objNewTask)
        save()  // lưu trữ lại
        inputAddTask.value = null
        renderTask()
    }
})

containerList.addEventListener('click', event => {
    const target = event.target
    if (target.tagName === 'LI') {
        idCurentList = event.target.dataset.listId
        localStorage.setItem(KEY_LIST_ID_CURENT_LOCAL_STORAGE, JSON.stringify(idCurentList))
        renderList() //  thay đổi select
        renderTask()
    }
})

showTasks.addEventListener('click', event => {
    if (event.target.tagName === 'INPUT') {
        // khi click vào -> thay đổi 
        const target = event.target
        const idTask = target.dataset.taskId
        const curentList = lists.find(list => list.listId === idCurentList)
        const curentTask = curentList.tasks.find(task => task.taskId === idTask)
        curentTask.complete = !curentTask.complete
        renderTotalNotComplete(curentList)
        save()
    }
})



btnDeleteTask.addEventListener('click', event => {
    const curentList = lists.find(list => list.listId === idCurentList)
    curentList.tasks = curentList.tasks.filter(task => !task.complete)
    save()
    renderTask()
})


btnDeleteList.addEventListener('click', event => {
    lists = lists.filter(list => list.listId != idCurentList)
    idCurentList = null
    save()
    renderList()
    renderTask()
})


// * Không lưu trữ lại quá trình element hiện tại vì các element thường xuyên bị xóa đi mỗi khi thêm mới.  


function createTask(taskName) {
    return {
        taskName: taskName,
        taskId: Date.now().toString(),
        complete: false
    }
}

function renderTotalNotComplete(list) {
    let totalNotComplete = list.tasks.filter(task => !task.complete).length
    let strShowComplete = totalNotComplete === 1 ? 'task not completed is 1' : `task not completed is ${totalNotComplete}`
    showTotalNotComplete.innerText = strShowComplete
}

function renderTask() {
    if (idCurentList) {
        clearChildElement(showTasks)
        containerTask.dataset.displayTask = 'flex'
        const curentList = lists.find(list => {
            return list.listId === idCurentList
        })
        renderTotalNotComplete(curentList)
        showTitleList.innerText = curentList.listName
        let dFrag = document.createDocumentFragment()
        curentList.tasks.forEach(task => {
            let labelElement = document.createElement('label')
            let inputElement = document.createElement('input')
            let spanElement = document.createElement('span')
            inputElement.dataset.taskId = task.taskId
            labelElement.classList.add('container')
            labelElement.innerText = task.taskName
            inputElement.type = 'checkbox'
            inputElement.checked = task.complete
            spanElement.classList.add('checkmark')

            labelElement.append(inputElement, spanElement)
            dFrag.append(labelElement)
        })
        showTasks.append(dFrag)
    }
    else {
        containerTask.dataset.displayTask = 'none'
    }
}

function renderList() {
    clearChildElement(containerList)
    let dFrag = document.createDocumentFragment()
    lists.forEach(list => {
        let listElement = document.createElement('li')
        let isActive = list.listId === idCurentList ? true : false
        if (isActive) {
            listElement.classList.add('active-list')
        }
        listElement.classList.add('list')
        listElement.innerText = list.listName
        listElement.dataset.listId = list.listId
        dFrag.append(listElement)
    });
    containerList.append(dFrag)
}

function save() {
    localStorage.setItem(KEY_LISTS_LOCAL_STORAGE, JSON.stringify(lists))
    localStorage.setItem(KEY_LIST_ID_CURENT_LOCAL_STORAGE, JSON.stringify(idCurentList))
}



function createList(nameList) {
    return {
        listName: nameList,
        listId: Date.now().toString(),
        tasks: [],
    }
}

function clearChildElement(parentElement) {
    while (parentElement.firstElementChild) {
        parentElement.firstElementChild.remove()
    }
}



// * Quy trình code 
// * 1. Get data 
// * 2. Logic ( sử lý giữ liệu )
// * 3. Render ( đưa hình ảnh lên cho người dùng )

