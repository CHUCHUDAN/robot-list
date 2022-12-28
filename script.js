const Base_URL = "https://user-list.alphacamp.io";
const INDEX_URL = Base_URL + "/api/v1/users";
const dataPanel = document.querySelector("#data-panel");//機器人render區塊
const searchButton = document.querySelector('#search-form')//search按鈕form區塊
const input = document.querySelector('#search-input') //input區塊
const robotPagination = document.querySelector('#robot-pagination')//顯示分頁區塊
const robotNavbar = document.querySelector('#robotNavbar') //navbar區塊
const ROBOT_PER_PAGE = 16 //每頁所顯示資料
const robot = []; //api取出的機器人資料
let currentPage = 1 //當前頁面 
let searchRobot = [] //search bar取出的資料
let favoriteRobot = [] //favorite清單

//render 機器人畫面
function renderContent(array) {
  let rawHTML = "";
  array.forEach(function (object) {
    rawHTML += `
  <div class="col-sm-3 mb-3 text-start">
    <div class="mb-2">
      <div class="card">
        <img src="${object.avatar}" alt="can't find picture">
        <div class="card-body">
          <h5 class="card-title">${object.name}</h5>
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-success" data-bs-toggle='modal' data-bs-target='#robotModal'
            data-id='${object.id}' id='robot-content'>Content</button>
          <button type="button" class="btn btn-info mx-2 " data-bs-toggle='modal' data-bs-target='#robotAddModal'
            data-id='${object.id}' id='robot-add'>add</button>
        </div>
      </div>
    </div>
  </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}
//render modal視窗資訊
function modalContent(id) {
  const avatar = document.querySelector("#robot-modal-avatar");
  const name = document.querySelector("#robot-modal-name");
  const surname = document.querySelector("#robot-modal-surname");
  const email = document.querySelector("#robot-modal-email");
  const gender = document.querySelector("#robot-modal-gender");
  const age = document.querySelector("#robot-modal-age");
  const region = document.querySelector("#robot-modal-region");
  const birthday = document.querySelector("#robot-modal-birthday");
  axios
    .get(`${INDEX_URL}/${id}`)
    .then(function (response) {
      const data = response.data;
      avatar.innerHTML = `
        <img class="img-thumbnail border-dark"  src="${data.avatar}" alt="no-data">
      `;
      name.innerText = data.name;
      surname.innerText = `surname: ${data.surname}`;
      email.innerText = `email: ${data.email}`;
      gender.innerText = `gender: ${data.gender}`;
      age.innerText = `age: ${data.age}`;
      region.innerText = `region: ${data.region}`;
      birthday.innerText = `birthday: ${data.birthday}`;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

//render 分頁
function renderPagination() {
  const data = searchRobot.length ? searchRobot : robot
  const numberOfPage = Math.ceil(data.length / ROBOT_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    if (page === currentPage) {
      rawHTML += `
      <li class="page-item active"><a class="page-link" data-page='${page}' href="#">${page}</a></li>
    `
    } else {
      rawHTML += `
      <li class="page-item"><a class="page-link" data-page='${page}' href="#">${page}</a></li>
    `
    }
  }
  robotPagination.innerHTML = rawHTML
}
//render 分頁資料
function renderPaginationData(pageNumber) {
  const data = searchRobot.length ? searchRobot : robot
  const startPage = (pageNumber - 1) * ROBOT_PER_PAGE
  const fixRobot = data.slice(startPage, startPage + ROBOT_PER_PAGE)
  return fixRobot
}
//search 功能
function searchFunction(keyWord) {
  searchRobot = robot.filter(r => r.name.toLowerCase().includes(keyWord))
  if (!searchRobot.length) {
    dataPanel.innerHTML = `
      <div class='  display-5 mx-2 mt-5  text-danger  text-center'>查無項目</div>
    `
    robotPagination.innerHTML = ""
    return
  }
  currentPage = 1
  renderPagination()
  renderContent(renderPaginationData(1))

}
//添加進favorite
function addFavorite(id) {
  axios
    .get(`${INDEX_URL}/${id}`)
    .then(function (response) {
      data = response.data
      const addModalBody = document.querySelector('#addModalBody')
      const list = JSON.parse(localStorage.getItem('robot-favorite')) || []
      const favorite = robot.find(r => r.id === id)
      if (list.find(l => l.id === id)) {
        addModalBody.innerHTML = `<h4>項目: <mark>${data.name}</mark>已存在於favorite清單中</h4>`
        return
      } else {
        addModalBody.innerHTML = `<h4>項目: <mark>${data.name}</mark>新增成功</h4>`
      }
      list.push(favorite)
      localStorage.setItem('robot-favorite', JSON.stringify(list))
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

}



//以下為事件監聽

//彈出modal事件&&新增favorite事件
dataPanel.addEventListener("click", function clickButton(event) {
  if (event.target.matches("#robot-content")) {
    const dataId = Number(event.target.dataset.id);
    modalContent(dataId);
  } else if (event.target.matches('#robot-add')) {
    const dataId = Number(event.target.dataset.id);
    addFavorite(dataId)
  }
});
//search按鈕submit事件
searchButton.addEventListener('submit', function clickSearchButton(event) {
  event.preventDefault()
  const keyWord = input.value.toLowerCase().trim()
  searchFunction(keyWord)
})
//input輸入框keyup事件
searchButton.addEventListener('keyup', function keyupInput() {
  const keyWord = input.value.toLowerCase().trim()
  searchFunction(keyWord)
})

//pagination點擊事件
robotPagination.addEventListener('click', function clickPagination(event) {
  if (event.target.tagName !== 'A') return
  const target = event.target
  const paginationActive = document.querySelector('#robot-pagination  .active')
  paginationActive.classList.remove('active')
  target.parentElement.classList.add('active')
  currentPage = Number(target.dataset.page)
  renderContent(renderPaginationData(currentPage))
})
//navbar樣式轉換事件
robotNavbar.addEventListener('click', function (event) {
  const navbarClassList = document.querySelector('#robotNavbar .rounded-3')
  const target = event.target
  navbarClassList.classList.remove('rounded-3', 'bg-light')
  target.parentElement.classList.add('rounded-3', 'bg-light')
})
//取得api
axios
  .get(`${INDEX_URL}`)
  .then(function (response) {
    const data = response.data.results;
    robot.push(...data);
    renderPagination()
    renderContent(renderPaginationData(currentPage));
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });