const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

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

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
     const template = this.menu[this.currentCategory]
       .map((item, index) => {
         return `
          <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${item.name}</span>
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
        const menuCount = $("#menu-list").querySelectorAll(
          "li"
        ).length;
        $(".menu-count").innerText = `총 ${menuCount} 개`;
  }

  const addMenuNameListner = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
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
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuNameListner = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  }

  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      editMenuNameListner(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuNameListner(e);
    }
  })

  // form 태그 자동 전송 되는걸 막는다.
  $("#menu-form").addEventListener("submit",
    (e) => {
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
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  })
}

const app = new App();
app.init();