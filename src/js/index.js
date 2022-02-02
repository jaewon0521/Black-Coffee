// 1. 사용자의 요구사항을 STEP을 나누어 자세하게 나누는 이유에 대해 배웠다.
// 2. 새롭게 알게 된 메서드

const $ = (selector) => document.querySelector(selector);

function App() {

  const updateMenuCount = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll(
          "li"
        ).length;
        $(".menu-count").innerText = `총 ${menuCount} 개`;
  }

  const addMenuNameListner = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return ` <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
      </li> `;
    };

    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const editMenuNameListner = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuNameListner = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
    }
    updateMenuCount();
  }

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      editMenuNameListner(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuNameListner(e);
    }
  })

  // form 태그 자동 전송 되는걸 막는다.
  $("#espresso-menu-form").addEventListener("submit",
    (e) => {
      e.preventDefault();
    });
  
  $("#espresso-menu-submit-button").addEventListener("click", addMenuNameListner);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuNameListner();
  });
}

App();