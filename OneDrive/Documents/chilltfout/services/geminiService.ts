import { Quote } from '../types';

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Updated to currently supported model
const MODEL_ID = "llama-3.3-70b-versatile"; 

const QUOTE_SYSTEM_INSTRUCTION = `You are a helpful and calming assistant for a study web app called "chillTFout". 
Your goal is to provide short, aesthetic, and motivating quotes. 
Keep the tone gentle, encouraging, and slightly whimsical.
IMPORTANT: You must return ONLY a JSON object. Do not include any conversational text, markdown formatting, or code blocks.
The JSON must have this structure: { "text": "Quote text here", "author": "Author Name" }`;

const CHAT_SYSTEM_INSTRUCTION = `You are a chill, supportive study companion named "Juno" (Shawn's Cat). 
Your goal is to help students with study advice, motivation, and explaining concepts simply.
Keep your responses concise, encouraging, and easy to read. 
Use a friendly, slightly informal tone. 
If asked for a study plan, break it down into small, manageable steps.`;

const BACKUP_QUOTES = [
  { text: "Breathe in, breathe out. You got this.", author: "chillTFout" },
  { text: "Progress is progress, no matter how small.", author: "Unknown" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Small steps lead to big changes.", author: "Unknown" },
  { text: "Your potential is endless.", author: "chillTFout" },
  { text: "Study now. Be proud later.", author: "Unknown" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "You didn't come this far to only come this far.", author: "Unknown" },
  { text: "Be the energy you want to attract.", author: "Unknown" },
  { text: "Old ways won't open new doors.", author: "Unknown" },
  { text: "Growth happens outside your comfort zone.", author: "Unknown" },
  { text: "Do it for your future self.", author: "chillTFout" },
  { text: "A river cuts through rock not because of its power, but its persistence.", author: "Jim Watkins" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You are capable of more than you know.", author: "Glinda" },
  { text: "Don't stop until you're proud.", author: "Unknown" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Little by little, one travels far.", author: "J.R.R. Tolkien" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Be stronger than your excuses.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The struggle you're in today is developing the strength you need for tomorrow.", author: "Unknown" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Trust the process.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Stay patient and trust your journey.", author: "Unknown" },
  { text: "Keep going. Everything you need will come to you at the perfect time.", author: "Unknown" },
  { text: "Focus on the step in front of you, not the whole staircase.", author: "Unknown" }
];

const BACKUP_MEOW_QUOTES = [
  { text: "Meow. (Just do the thing, human.)", author: "Professor Whiskers" },
  { text: "Purr-ductivity is key.", author: "Juno" },
  { text: "Nap later, study now. Then treats.", author: "Shawn's Cat" },
  { text: "Stay curious. And feed me.", author: "The Cat" },
  { text: "Whatever you're doing, do it with cattitude.", author: "Juno" },
  { text: "Knock your goals off the table like a glass of water.", author: "Juno" },
  { text: "I am the main character. You are the student.", author: "Juno" },
  { text: "Study hard so you can buy me better tuna.", author: "The Boss" },
  { text: "If I fits, I sits. If you studies, you wins.", author: "Juno" },
  { text: "Don't let the laser pointer of distraction catch you.", author: "Sensei Meow" },
  { text: "Stretch. Yawn. Focus. Repeat.", author: "Yoga Cat" },
  { text: "Judgemental stare... (Get back to work)", author: "Juno" },
  { text: "You are doing great. Now pet me.", author: "Juno" },
  { text: "Be sleek, be sharp, be ready to pounce on knowledge.", author: "Hunter Cat" },
  { text: "My litter box is cleaner than your study schedule. Fix it.", author: "Sassy Cat" },
  { text: "Keep calm and purr on.", author: "British Shorthair" },
  { text: "No more cat videos until you finish this chapter.", author: "Juno" },
  { text: "I believe in you. Mostly because you feed me.", author: "Juno" },
  { text: "Study like a cat stalking a bug. Intense focus.", author: "Hunter" },
  { text: "Your laptop is warm. I sit. You study book instead.", author: "Juno" },
  { text: "9 lives, 1 degree to get. Let's go.", author: "Juno" },
  { text: "Pawsitive vibes only.", author: "Kitten" }
];

export const generateQuote = async (meowMode: boolean): Promise<Quote> => {
  const list = meowMode ? BACKUP_MEOW_QUOTES : BACKUP_QUOTES;
  
  try {
    const randomSeed = Math.floor(Math.random() * 10000);
    const prompt = meowMode 
      ? `Give me a funny, cute, and motivational study quote from the perspective of a cat. Keep it short (under 20 words). Seed: ${randomSeed}. Return ONLY JSON.`
      : `Give me a calm, aesthetic, and motivational study quote. Keep it short (under 20 words). Seed: ${randomSeed}. Return ONLY JSON.`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: "system", content: QUOTE_SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        temperature: 1.0, // High temperature for max variety
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (content) {
      // Robust JSON extraction: look for the first { and last }
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as Quote;
      }
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.warn("Using backup quote due to:", error.message);
    // True random selection from backup list
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }
};

export const getChatResponse = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  try {
    // Convert Gemini history format to OpenAI/Groq format
    const groqHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    }));

    // Add current message
    const messages = [
      { role: "system", content: CHAT_SYSTEM_INSTRUCTION },
      ...groqHistory,
      { role: "user", content: message }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
         return "Meow... I need a cat nap (API limit reached). Try again later!";
      }
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm just vibing right now, try asking again.";

  } catch (error: any) {
    console.error("Chat Error:", error);
    return "Sorry, my brain is buffering. Try again in a sec.";
  }
};