require('dotenv').config();

// async function generateCurrentDate() {

//   try {
//     const promptDate = new Date();
//     promptDate.setHours(0, 0, 0, 0);
//     return { result: promptDate}; // Ensure it's returned as an object with a 'result' property
//   } catch (error) {
//     console.error("Error generating date:", error);
//     return { result: "Error generating date." }; // Return a fallback message if an error occurs
//   }

// }

async function createGoodDeed() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI("AIzaSyCck5Wz3v3rxKVYqF49yC9SeYMOatTxanQ");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = "give me 1 random act of kindness to do, one short sentence, no repeats, completely different to your different answer";
  const promptDate = new Date();
  promptDate.setHours(0, 0, 0, 0);

  try {
    const result = await model.generateContent(prompt);
    console.log('Generated kindness act:', result.response.text()); // Log the response to check
    return { result: result.response.text(), promptDate}; // Ensure it's returned as an object with a 'result' property
  } catch (error) {
    console.error("Error generating kindness act:", error);
    return { result: "Error generating kindness act." }; // Return a fallback message if an error occurs
  }

}
// module.exports = generateCurrentDate;
module.exports = createGoodDeed;
