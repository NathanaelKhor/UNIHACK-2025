require('dotenv').config();

async function createGoodDeed() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = "give me 1 random act of kindness to do, one short sentence, no repeats, completely different to your different answer";

  try {
    const result = await model.generateContent(prompt);
    console.log('Generated kindness act:', result.response.text()); // Log the response to check
    return { result: result.response.text() }; // Ensure it's returned as an object with a 'result' property
  } catch (error) {
    console.error("Error generating kindness act:", error);
    return { result: "Error generating kindness act." }; // Return a fallback message if an error occurs
  }
}

module.exports = createGoodDeed;
