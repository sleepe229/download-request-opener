document.addEventListener("DOMContentLoaded", () => {
    const domainInput = document.getElementById("domainInput");
    const addDomainBtn = document.getElementById("addDomainBtn");
    const domainList = document.getElementById("domainList");
  
    // Загрузка сохранённых доменов при загрузке popup
    chrome.storage.sync.get("domains", function(data) {
      const domains = data.domains || [];
      domains.forEach(domain => addDomainToUI(domain));
    });
  
    // Добавление домена в список
    addDomainBtn.addEventListener("click", () => {
      const domain = domainInput.value.trim();
      if (domain) {
        chrome.storage.sync.get("domains", function(data) {
          const domains = data.domains || [];
  
          // Добавляем домен, если его нет в списке
          if (!domains.includes(domain)) {
            domains.push(domain);
  
            // Сохраняем обновлённый список доменов
            chrome.storage.sync.set({ domains: domains }, function() {
              addDomainToUI(domain);
              domainInput.value = ""; // Очищаем поле ввода
            });
          } else {
            alert("Домен уже добавлен");
          }
        });
      }
    });
  
    // Функция для отображения домена в интерфейсе
    function addDomainToUI(domain) {
      const li = document.createElement("li");
      li.textContent = domain;
  
      // Добавляем кнопку для удаления домена
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Удалить";
      removeBtn.style.marginLeft = "10px";
      removeBtn.addEventListener("click", () => {
        chrome.storage.sync.get("domains", function(data) {
          const domains = data.domains.filter(d => d !== domain);
  
          // Обновляем хранилище
          chrome.storage.sync.set({ domains: domains }, function() {
            li.remove(); // Удаляем домен из UI
          });
        });
      });
  
      li.appendChild(removeBtn);
      domainList.appendChild(li);
    }
  });
  