// todo : SELECT 
const containerListsEl = document.getElementById('lists')
const newListFormEl = document.getElementById('form-add-list')
const inputAddListEl = document.getElementById('input-add-list')
const containerTaskEl = document.getElementById('wrap-tasks')
const bodyTasksEl = document.getElementById('body-task')
const newTaskFormEl = document.getElementById('form-add-task')
const inputAddTaskEl = document.getElementById('input-task')
const btnClearList =document.querySelector('[data-clear-lists]')
const btnClearTask = document.querySelector('[data-delete-tasks]')
const KEY_LISTS_IN_LOCALSTORAGE = 'lists' //  * key trong localstorage 
const kEY_LIST_CURENT_ID_LOCALSTORAGE = 'listCurentId'

btnClearList.addEventListener('click',event =>{ 
    // xóa đi toàn bộ list 
    lists = []
    curentId = ''
    localStorage.removeItem(KEY_LISTS_IN_LOCALSTORAGE)
    renderAndSaveLoCalStorage()
})
 


// bắt sự kiện 

btnClearList.addEventListener('click',event=> { 
    
} )



let lists = JSON.parse(localStorage.getItem(KEY_LISTS_IN_LOCALSTORAGE)) || []
let curentId = JSON.parse(localStorage.getItem(kEY_LIST_CURENT_ID_LOCALSTORAGE)) || '' 





const render = () => { 
    const htmlInLists = lists.map( list => { 
        let isActivate = list.id === curentId ? true : false 
        let listClassChild = isActivate ? 'list-name active-list' : 'list-name'
        return `<li data-list-id='${list.id}' class='${listClassChild}'>${list.listName}</li>`
    })
    containerListsEl.innerHTML = htmlInLists.join('')
    renderList()
}



render()


// * ý tưởng : khi 1 thằng được click => thay đổi trạng thái hiện tại -> cho render lai 

function createList(nameNewList) { 
    return {  
        id:Date.now().toString(), 
        listName:nameNewList,
        tasks:[]  // * chứa danh sách chi tiết các việc cần làm của list đó. 
    }
}

newListFormEl.addEventListener('submit',event => { 
    event.preventDefault() 
    const valueInput = inputAddListEl.value 
    if (valueInput) { 
        const objectList = createList(valueInput)
        lists.push(objectList) 
        renderAndSaveLoCalStorage()
        inputAddListEl.value = null
    }

})

function saveLocalStorage () { 
    localStorage.setItem(KEY_LISTS_IN_LOCALSTORAGE,JSON.stringify(lists))
    localStorage.setItem(kEY_LIST_CURENT_ID_LOCALSTORAGE,JSON.stringify(curentId))
}


function renderAndSaveLoCalStorage() { 
    render()
    saveLocalStorage()
}

function renderList() {
    let objectCurent = lists.find(list => list.id === curentId)
    if (objectCurent) { 
        containerTaskEl.style.display = ''
        
        let headerTask = containerTaskEl.firstElementChild 
        headerTask.firstElementChild.textContent = objectCurent.listName
        let htmlTasks = objectCurent.tasks.map(task => { 
            let span = task.competed ? '<input checked type="checkbox">' : '<input  type="checkbox">'
            return `
            <label class="container">${task.taskName}
                ${span}
                <span class="checkmark"></span>
            </label>
            `
        })
        bodyTasksEl.innerHTML = htmlTasks.join('')
        return
    }
    containerTaskEl.style.display = 'none'
    
}


containerListsEl.addEventListener('click',event => { 
    const target = event.target
    if (target.tagName === 'LI') {
        curentId = event.target.dataset.listId 
       renderAndSaveLoCalStorage()
    }
})






newTaskFormEl.addEventListener('submit',event => { 
    event.preventDefault()
    const valueInput = inputAddTaskEl.value
    if (valueInput) { 
        let objectCurent = lists.find(list => list.id === curentId) 
        let newTask = createTask(valueInput)
        objectCurent.tasks.push(newTask)
        localStorage.setItem(KEY_LISTS_IN_LOCALSTORAGE,JSON.stringify(lists)) 
        render()
        inputAddTaskEl.value = null
    }
})

function createTask(name) { 
    return { 
        taskName:name, 
        competed:false, 
        id:Date.now().toString()
    }
}



// todo : function 
// * 1.Thêm list 
// * 2. Hiển thị task 
// * 3. Xóa list đang select 
// * 4. Xóa toàn bộ task thuộc 1 list 




// * tag template được sử dụng khi có 1 đoạn mã html sử dụng ở nhiều nơi. template không được hiển thị trên trình duyệt. muốn sử dụng template để hiển thị lên trang web chỉ có thể sử dụng javasctipt 



// * method content khá giống với method children, Nhưng content return về cả comment trong tag
/* const templateTag =document.querySelector('[data-temp]')
const cloneTemplate = templateTag.cloneNode(true) 
console.log(cloneTemplate) */
// cloneNode ra



// * Nên tạo ra các element hơn là sử dụng innerHTML.
// * Sử dụng innerHTML trang web sẽ phân tích lại DOM của element đó
// * Khi tạo ra phần tử thì ta không tích lại DOM mà chỉ găn node đó vào DOM 


// * Sử dụng innerHTML trong trường hợp nguồn html được chèn vào đáng tin cậy. hacker có thể lợi dụng chèn mã độc vào mã  


// * khi bạn append nhiều lần. Việt này sẽ khiến trang web phải đánh giá lại nhiều lần, tính toán và vẻ lại, nên sử dụng DocumentFragment để có thể cập nhập vào DOM chỉ 1 lần. 

// * Sử dụng DocumentFragment để soạn các nút DOM trước khi cập nhật chúng vào cây DOM đang hoạt động để có được hiệu suất tốt hơn.
