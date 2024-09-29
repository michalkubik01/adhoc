// noicePanel.bundle.js or popup.js

document.addEventListener("DOMContentLoaded", () => {
  const showDataButton = document.getElementById("noiceButton");

  showDataButton.addEventListener("click", () => {
    // Request the stored data from the background script
    chrome.runtime.sendMessage({ type: "GET_STORED_DATA" }, (response) => {
      if (response && response.data) {
        for (let i = 0; i < response.data.length; i++) {
          questions(response.data[i]);
        }
      } else {
        alert("No data available.");
      }
    });
  });
});

function questions(data) {
  const answer = window.prompt(
    data.question +
      "\n" +
      "1. " +
      data.answers[0] +
      "\n" +
      "2. " +
      data.answers[1] +
      "\n" +
      "3. " +
      data.answers[2] +
      "\n" +
      "4. " +
      data.answers[3],
    "1"
  );
  console.log("right answer: " + (data.correctAnswer + 1));
  if (answer === String(data.correctAnswer + 1)) {
    alert("Correct!");
  } else {
    alert("Wrong!");
  }
}
