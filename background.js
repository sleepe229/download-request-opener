chrome.webRequest.onCompleted.addListener(
    async function(details) {
      const url = new URL(details.url);
      const domain = url.hostname;
  
      // Проверяем, есть ли параметр processed, чтобы не запускать повторное скачивание
      if (url.searchParams.has("processed")) {
        return; // Прерываем обработку, если этот запрос уже был обработан
      }
  
      // Получаем список доменов из хранилища
      chrome.storage.sync.get("domains", function(data) {
        const domains = data.domains || [];
  
        // Проверяем, есть ли домен в списке отслеживаемых
        if (domains.some(addedDomain => domain.includes(addedDomain))) {
          // Проверяем, содержит ли URL слово "download"
          if (url.href.includes("download")) {
            // Добавляем параметр "processed=true", чтобы избежать бесконечных циклов
            url.searchParams.append("processed", "true");
  
            // Открываем URL в новой вкладке с добавленным параметром
            chrome.tabs.create({ url: url.href });
          }
        }
      });
    },
    { urls: ["<all_urls>"] }
  );
  
  chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
      // Проверяем, есть ли уже домены в хранилище
      chrome.storage.sync.get("domains", function(data) {
        const domains = data.domains || [];
        
        // Если доменов нет, добавляем "academygps.ru"
        if (domains.length === 0) {
          chrome.storage.sync.set({ domains: ["academygps.ru"] }, function() {
            console.log("Домен academygps.ru добавлен в список отслеживаемых.");
          });
        }
      });
    }
  });