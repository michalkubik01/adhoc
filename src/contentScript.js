import { YoutubeTranscript } from "youtube-transcript";
import { OpenAI } from "openai";
import { PROMPT } from "./helpers";

const OPENAI_API_KEY = ""; // Add your OpenAI API key here through env var or else

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("v");

// Add a listener to handle messages from the popup or background scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTranscription") {
    const transcriptElements = document.querySelectorAll(
      "ytd-transcript-segment-renderer div#content"
    );
    const transcription = Array.from(transcriptElements)
      .map((elem) => elem.textContent)
      .join(" ");

    sendResponse({ transcription });
  }
});

if (videoId) {
  console.log(`Found YouTube video ID: ${videoId}`);

  let transcript;
  try {
    console.log("Fetching transcript...");
    transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("Transcript fetched successfully");
  } catch (error) {
    console.error("Error fetching transcript:", error);
  }

  const transcriptionText = transcript.map((entry) => entry.text).join(" ");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: PROMPT },
        {
          role: "user",
          content: transcriptionText,
        },
      ],
    });
    const content = completion.choices[0].message.content;
    const finalContent = JSON.parse(content);

    // mock random question generation
    await new Promise((r) => setTimeout(r, 25000));

    const answer = window.prompt(
      finalContent[0].question +
        "\n" +
        "1. " +
        finalContent[0].answers[0] +
        "\n" +
        "2. " +
        finalContent[0].answers[1] +
        "\n" +
        "3. " +
        finalContent[0].answers[2] +
        "\n" +
        "4. " +
        finalContent[0].answers[3],
      "1"
    );
    console.log("right answer: " + (finalContent.correctAnswer + 1));
    if (answer === String(finalContent.correctAnswer + 1)) {
      alert("Correct!");
    } else {
      alert("Wrong!");
    }

    for (let i = 0; i < finalContent.length; i++) {
      console.log(`Generated question ${i + 1}: `, finalContent[i].question);
      console.log(`Generated answers ${i + 1}: `, finalContent[i].answers);
      console.log(
        `Generated correct answer ${i + 1}: `,
        finalContent[i].correctAnswer
      );
    }

    chrome.runtime.sendMessage(
      { type: "STORE_DATA", data: finalContent },
      (response) => {
        console.log("Data sent to background:", finalContent);
      }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
  }
} else {
  console.log("This is not a YouTube video page.");
}
