import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc Generate a book outline
// @route POST /api/generate-outline
// @access Private

const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Please provide a topic" });
    }
    const prompt = `You are an expert book outline generator create a comprehensive book outline based on the following requirements:

    Topic: "${topic}"
    ${description ? `Description : ${description}` : ""}
    Writing Style: ${style}
    Number of chapters: ${numChapters || 5}

    Requirements:
    1. Generate exactly ${numChapters || 5}chapters
    2. Each chapter title should be clear engaging and follow all logical progression
    3. Each chapter description should be 2-3 sentence explaining what the chapter covers
    4. Insure chapters build among each other coherently
    5. Match the ${style} writing style in your titles and descriptions

    Output Formate:
    Return only a valid JSON array with no additional text, markdown or formatting. each object must have exactly two keys: "titled" and "description".

    Example structure:

    [
       { "title": "Chapter 1 : Introduction to the topic",
        "description": "A comprehensive overview introducing the main concepts set the foundation for understanding the subject matter"
       },
       { "title": "Chapter 2 : Core principals",
        "description": "explore the fundamental principle and theories provides detailed example and real world applications"
       }
    ]
    
    Generate the Outline now
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;
    // Find and extract the JSON array from the response text

    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.log("Could not find JSON array in AI response : ", text);
      return res
        .status(500)
        .json({ message: "Failed to parse AI response, no JSON array found." });
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    try {
      // Validate if the response is valid JSON
      const outline = JSON.parse(jsonString);
      res.status(200).json({ outline });
    } catch (e) {
      console.error("Failed to parse AI response : ", jsonString);
      res.status(500).json({
        message:
          "Failed to generate a valid outline. The AI response was not valid JSON.",
      });
    }
  } catch (error) {
    console.log("Error generating outline:", error);
    res
      .status(500)
      .json({ message: "server error during AI outline generation" });
  }
};

// @desc Generate content for a chapter
// @route POST /api/ai/generate-chapter-content
// @access Private

const generateChapterContent = async (req, res) => {
  try {
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle) {
      return res
        .status(400)
        .json({ message: "please provide a chapter title" });
    }

    const prompt = ` You are a an expert writer specializing in ${style} content. write a complete chapter 4A book with the following specifications
     
    Chapter Title: "${chapterTitle}"
    ${chapterDescription ? `Chapter Description: ${chapterDescription}` : ""}
     Writing Style: ${style}
     Target Length: Comprehensive and detailed (aim for 1500 to 2500 words)

     Requirenments:
     1. write in a ${style.toLowerCase()} tone throughout the chapter
     2. Structure the content with the clear sections and smooth transitions
     3. Include relevant examples, explanations or anecdotes as appropriate for the style
     4. In short the content flows logically from introduction to conclusion
     5. Make the content engaging and valuable to readers
     ${
       chapterDescription
         ? "6. Cover old points mentioned in the chapter description"
         : ""
     }
     
     Format guidelines:
     - start with a compelling opinion paragraph
     - Use clear paragraph breack for readability
     - include subheading if appropriate for the content length
     - End with a strong conclusion or transitions to the next chapter 
     - write in plain text without markdown formatting

     Begin writing the chapter content now:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    res.status(200).json({ content: response.text });
  } catch (error) {
    console.log("Error generating chapter:", error);
    res
      .status(500)
      .json({ message: "server error during AI outline generation" });
  }
};

export { generateOutline, generateChapterContent };
