const brandInput = document.getElementById("brand-input");
const carListUl = document.getElementById("car-list-ul");
const carServiceUl = document.getElementById("car-service-ul");
const deliveredCarList = document.getElementById("delivered-car-ul");

let carArray = sessionStorage.getItem("car") ? JSON.parse(sessionStorage.getItem("car")) : [];
let serviceArray = sessionStorage.getItem("service") ? JSON.parse(sessionStorage.getItem("service")) : [];
let deliveredArray = sessionStorage.getItem("delivered") ? JSON.parse(sessionStorage.getItem("delivered")) : [];

//loadList: Mevcut bir diziyi alır ve her bir öğeyi belirtilen listeye ekler.
function loadList(array, listElement, buttonCreator) {
  array.forEach((item) => addItemToList(item, listElement, buttonCreator));
}

//Bu fonksiyon, üç farklı diziyi ve bunlara karşılık gelen liste öğelerini yükler.
//Her bir dizi için loadList fonksiyonunu çağırır ve ilgili liste öğelerine ekler.
function loadLists() {
  loadList(carArray, carListUl, createCarListButtons);
  loadList(serviceArray, carServiceUl, createServiceListButtons);
  loadList(deliveredArray, deliveredCarList);
}

function returnButton(type, id, innerHTML) {
  const returnButton = document.createElement(type);
  returnButton.id = id;
  returnButton.innerHTML = innerHTML;
  return returnButton;
}

function groupButtons(buttons) {
  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("buttonGroup");
  buttons.forEach((button) => buttonGroup.appendChild(button));
  return buttonGroup;
}

function addItemToList(item, listElement, buttonCreator) {
  const li = document.createElement("li");
  li.textContent = item;
  if (buttonCreator) {
    buttonCreator(li);
  }
  listElement.appendChild(li);
}

function submit() {
  if (brandInput.value === "") {
    alert("Araba markası giriniz:");
  } else {
    const brandCarList = brandInput.value;
    addItemToList(brandCarList, carListUl, createCarListButtons);
    carArray.push(brandCarList);
    sessionStorage.setItem("car", JSON.stringify(carArray));
    brandInput.value = "";
  }
}

brandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submit();
  }
});

function addClickEvent(button, callback) {
  button.addEventListener("click", callback);
}

function createCarListButtons(li) {
  const item = li.textContent;
  const settingsButton = returnButton("button", "setBtn", '<i class="fa-solid fa-gears"></i>');
  const deleteButton = returnButton("button", "deleteBtn", '<i class="fa-solid fa-trash"></i>');

  addClickEvent(settingsButton, () => {
    addItemToList(item, carServiceUl, createServiceListButtons);
    serviceArray.push(item);
    sessionStorage.setItem("service", JSON.stringify(serviceArray));
    carArray = carArray.filter((car) => car !== item);
    sessionStorage.setItem("car", JSON.stringify(carArray));
    li.remove();
  });

  addClickEvent(deleteButton, () => {
    carArray = carArray.filter((car) => car !== item);
    sessionStorage.setItem("car", JSON.stringify(carArray));
    li.remove();
  });

  const buttonCarList = groupButtons([deleteButton, settingsButton]);
  li.appendChild(buttonCarList);
}

function createServiceListButtons(li) {
  const item = li.textContent;

  const backButton = returnButton("button", "backBtn", '<i class="fa-solid fa-backward"></i>');
  const carButton = returnButton("button", "carBtn", '<i class="fa-solid fa-car"></i>');

  addClickEvent(backButton, () => {
    addItemToList(item, carListUl, createCarListButtons);
    carArray.push(item);
    sessionStorage.setItem("car", JSON.stringify(carArray));
    serviceArray = serviceArray.filter((car) => car !== item);
    sessionStorage.setItem("service", JSON.stringify(serviceArray));
    li.remove();
  });

  addClickEvent(carButton, () => {
    addItemToList(item, deliveredCarList);
    deliveredArray.push(item);
    sessionStorage.setItem("delivered", JSON.stringify(deliveredArray));
    serviceArray = serviceArray.filter((car) => car !== item);
    sessionStorage.setItem("service", JSON.stringify(serviceArray));
    li.remove();
  });

  const buttonCarServiceList = groupButtons([backButton, carButton]);
  li.appendChild(buttonCarServiceList);
}

loadLists();
