function App() {
  // form 태그 자동 전송 되는걸 막는다.
  document.querySelector("#espresso-menu-form").addEventListener("submit",
    (e) => {
      e.preventDefault();
    });

  // 1. 메뉴의 이름을 입력받는다.
  document.querySelector("#espresso-menu-name").addEventListener("keypress",
    (e) => {
      console.log(e.key);
      if (e.key === "Enter") {
        
      }
  });
}

App();