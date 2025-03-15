require('dotenv').config();

async function createGoodDeed() {
  
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;

  prompt = "introduce yourself"

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    // Make the request to gemini
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Extract the generated text 
    const result = data.candidates[0].content.parts[0].text;


    return {
      result
    };

  } catch (error) {
    console.error("Error generating text:", error);
    return { result: "Error generating text." };
  }

}
  
  module.exports = createGoodDeed;


  // "AIzaSyCck5Wz3v3rxKVYqF49yC9SeYMOatTxanQ"