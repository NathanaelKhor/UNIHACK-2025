require('dotenv').config();

async function createGoodDeed() {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;
  const prompt = "give me 1 random act of kindness to do, one short sentence, no repeats, completely different to your different answer";

  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI("AIzaSyCck5Wz3v3rxKVYqF49yC9SeYMOatTxanQ");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  // console.log("Starting script...");
  // console.log(process.env.PORT);
  // console.log("API Key Loaded:", process.env.GOOGLE_API_KEY);
  // const requestBody = {
  //   contents: [{ parts: [{ text: prompt }] }]
  // };

  // console.log("Request Body:", JSON.stringify(requestBody, null, 2));




//   try {
//     const response = await fetch(URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("API Response:", data); // Log the response to check its structure

//     // Check if the expected data is present
//     if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
//       const result = data.candidates[0].content.parts[0].text;
//       return { result };
//     } else {
//       throw new Error("Unexpected response format.");
//     }

//   } catch (error) {
//     console.error("Error generating text:", error);
//     return { result: "Error generating text." };
//   }
}
  
  module.exports = createGoodDeed;
