const $ = (selector) => document.querySelector(selector);

function App() {
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedMenuName = prompt("메뉴명을 수정해주세요.", $menuName.innerText);
      $menuName.innerText = updatedMenuName;
    }
  })
  // form 태그 자동 전송 되는걸 막는다.
  $("#espresso-menu-form").addEventListener("submit",
    (e) => {
      e.preventDefault();
    });
  
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
    // count 변수 = li 갯수 카운트
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;

    $("#espresso-menu-name").value = "";
  };
  
  $("#espresso-menu-submit-button").addEventListener("click", () => {
    addMenuNameListner();
  });

  // 1. 메뉴의 이름을 입력받는다.
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addMenuNameListner();
  });
}

App();