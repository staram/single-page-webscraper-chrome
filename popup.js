chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    var title = tab.title;
    document.getElementById("page-title").value = title.replace(/[|&:;$%@"<>()+,]/g, "-");

    var url = tab.url;
    document.getElementById("page-url").value = url;

    // get body innerText
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: getInnerText
    });

  });

function getInnerText() {
    const innerText = document.body.innerText;
    chrome.runtime.sendMessage({innerText: innerText});
}
  
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.innerText) {
      document.getElementById("page-text").textContent = message.innerText;
    }
});




// SAVE PROMPT?
// popup.js
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("save-button").addEventListener('click', saveTextToFile); 
});



function saveTextToFile() {
  const textToSave = document.getElementById("page-text").value;

  if (!textToSave) {
      alert("Please enter some text to save.");
      return;
  }

  const blob = new Blob([textToSave], {type: 'text/plain;charset=utf8'});
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
      url: url, 
      filename: "SAVEFILE.txt",
      saveAs: true
  });

  

  URL.revokeObjectURL(url);
}


