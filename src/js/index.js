import { $ } from './utils/dom.js';
import store from './store/index.js';

const BASE_URL = "http://localhost:3000/api";

const menuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`)
    return response.json();
  }
}

function App() {
  // 상태는 변하는 데이터 - 갯수, 메뉴명
  this.menu = {
    espresso : [],
    frappuccino : [],
    blended : [],
    teavana : [],
    desert : [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListners();
  };

  const render = () => {
     const template = this.menu[this.currentCategory]
       .map((item, index) => {
         return `
          <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            item.soldOut ? "sold-out" : ""
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

    const menuName = $("#menu-name").value;

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    })
      .then((response) => {
        return response.json();
      })
    
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $("#menu-name").value = "";
  
  };

  const editMenuNameListner = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);

    render();
  }

  const removeMenuNameListner = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);

      render();
    }
  }

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  }

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

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  }

}

const app = new App();
app.init();