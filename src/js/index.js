import { $ } from './utils/dom.js';
import store from './store/index.js';
import menuApi from './api/index.js';

function App() {
  // 상태는 변하는 데이터 - 갯수, 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    render();
    initEventListners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `
          <li data-menu-id="${item.id}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""
          }">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join(""); // <li>~</li><li>~</li>

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  }

  const addMenuNameListner = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    console.log(duplicatedItem);
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    const menuName = $("#menu-name").value;
    await menuApi.createMenu(this.currentCategory, menuName);
    render();

    $("#menu-name").value = "";
  };

  const editMenuNameListner = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정해주세요.", $menuName.innerText);
    await menuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  }

  const removeMenuNameListner = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await menuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  }

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await menuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  }

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        editMenuNameListner(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuNameListner(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuNameListner);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuNameListner();
    });

    $("nav").addEventListener("click", changeCategory);
  }
}

const app = new App();
  app.init();