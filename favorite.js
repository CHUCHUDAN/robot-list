const Base_URL = "https://user-list.alphacamp.io"
const INDEX_URL = Base_URL + "/api/v1/users"
const dataPanel = document.querySelector('#data-panel')
const favoriteList = JSON.parse(localStorage.getItem('robot-favorite'))
const robotDeleteAll = document.querySelector('#robotDeleteAll')
//render favorite清單畫面
function renderfavorite(array) {
  let rawHTML = "";
  array.forEach(function (object) {
    rawHTML += `
      <div class="col-3 mb-3 mt-4 text-start">
          <div class="card">
            <img src="${object.avatar}"
              alt="can't find picture">
            <div class="card-body">
              <h5 class="card-title">${object.name}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-success" data-bs-toggle='modal' data-bs-target='#robotModal' data-id='${object.id}' id='robot-content'>Content</button>
              <button type="button" class="btn btn-danger mx-2 " data-bs-toggle='modal' data-bs-target='#robotDelete' data-id='${object.id}' data-name='${object.name}' id='robot-delete'>x</button>
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

//刪除favorite
function deleteFavorite(id) {
  let list = JSON.parse(localStorage.getItem('robot-favorite'))
  list = list.filter(l => l.id !== id)
  localStorage.setItem('robot-favorite', JSON.stringify(list))
  renderfavorite(list)
}

//刪除全部favorite
function deleteAllFavorite () {
  let list = JSON.parse(localStorage.getItem('robot-favorite'))
  if (list) {
    localStorage.removeItem('robot-favorite')
    dataPanel.innerHTML = ''
  }
}

//以下為事件監聽

//彈出modal事件&&刪除favorite事件
dataPanel.addEventListener("click", function clickButton(event) {
  if (event.target.matches("#robot-content")) {
    const dataId = Number(event.target.dataset.id);
    modalContent(dataId);
  } else if (event.target.matches('#robot-delete')) {
    const dataId = Number(event.target.dataset.id);
    const dataName = event.target.dataset.name
    const deleteButton = document.querySelector('#deleteButton')
    const deleteModalBody = document.querySelector('#deleteModalBody')
    deleteModalBody.innerHTML = `<h4>是否將項目: <mark>${dataName}</mark>刪除</h4>`
    deleteButton.addEventListener('click', function clickDeleteButton() {
      deleteFavorite(dataId)
    })
  }
})

//全部刪除事件
robotDeleteAll.addEventListener('click', function(event) {
  const target = event.target
  if (target.matches('.robotDeleteAll')) {
    deleteAllFavorite()
  }
  
})
renderfavorite(favoriteList)