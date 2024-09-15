const User = require('../models/userModel');
const Course = require('../models/courseModel');
const openai = require('../configs/openai.config');  // Your OpenAI config

// Generate course using AI and save it to the database
// const generateCourse = async (userId, language) => {
//   const prompt = `Generate a beginner's course to learn ${language} with a course title, 3 modules, and each module containing 3 sections.`;

//   const aiResponse = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     prompt: prompt,
//     max_tokens: 1024,
//   });

//   const aiGeneratedCourse = JSON.parse(aiResponse.data.choices[0].text);

//   const newCourse = new Course({
//     title: aiGeneratedCourse.courseTitle,
//     language: language,
//     modules: aiGeneratedCourse.modules.map(module => ({
//       moduleTitle: module.moduleTitle,
//       sections: module.sections.map(section => ({
//         sectionTitle: section.sectionTitle,
//         body: section.body,
//       })),
//     })),
//   });

//   await newCourse.save();

//   const user = await User.findById(userId);

//   // Add course reference and initialize progress in user's document
//   user.coursesProgress.push({
//     course: newCourse._id,
//     completedSections: [],
//     progress: 0,
//   });

//   await user.save();
//   return newCourse;
// };
// const generateCourse = async (userId, language) => {
//   try {
//     const prompt = `Generate a beginner's course to learn english  The output should be in JSON format with the following structure: 
//     {
//       "courseTitle": "string",
//       "modules": [
//         {
//           "moduleTitle": "string",
//           "sections": [
//             {
//               "sectionTitle": "string",
//               "body": "string"
//             }
//           ]
//         }
//       ]
//     }`;
//     // Make API call to OpenAI v4 chat completions
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are an AI that helps in course generation to help learn new languages like duolingo app." },
//         { role: "user", content: prompt }
//       ],
//       max_tokens: 1024,
//       temperature: 0.7,
//       top_p: 1.0,
//     });

//     // Ensure response contains expected fields
//     if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
//       throw new Error('Unexpected response format from OpenAI');
//     }

//     // const aiGeneratedCourse = JSON.parse(aiResponse.choices[0].message.content);
//     // Extract the response content
//     let aiGeneratedCourseText = aiResponse.choices[0].message.content;

//     // Clean up the response content
//     aiGeneratedCourseText = aiGeneratedCourseText
//       .replace(/```json/, '')  // Remove the start of a JSON code block
//       .replace(/```/, '')      // Remove the end of a code block
//       .trim();                 // Trim any extra whitespace
//     const newCourse = new Course({
//       title: aiGeneratedCourse.courseTitle,
//       language: language,
//       modules: aiGeneratedCourse.modules.map(module => ({
//         moduleTitle: module.moduleTitle,
//         sections: module.sections.map(section => ({
//           sectionTitle: section.sectionTitle,
//           body: section.body,
//         })),
//       })),
//     });

//     await newCourse.save();

//     const user = await User.findById(userId);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     user.coursesProgress.push({
//       course: newCourse._id,
//       completedSections: [],
//       progress: 0,
//     });

//     await user.save();
//     return newCourse;

//   } catch (error) {
//     console.error('Error generating course:', error); // Log the error
//     throw error; // Re-throw to propagate to the controller
//   }
// };

const generateCourse = async (userId, language) => {
  try {
    const prompt = `Give me a language learning course with 3 modules and 3 sections each the sections and sections body should be detailed teaching like a book that teaches the language consider yourself as the language tutor.The language is ${language}.The output should be in JSON format with the following structure without code block markers:
{
  "courseTitle": "string",
  "modules": [
    {
      "moduleTitle": "string",
      "sections": [
        {
          "sectionTitle": "string",
          "body": "string"
        }
      ]
    }
  ]
}`;

    // Make API call to OpenAI v4 chat completions
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI that helps in course generation." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 1.0,
    });

    // Extract the response content
    let aiGeneratedCourseText = aiResponse.choices[0].message.content;

    // Clean up the response content
    aiGeneratedCourseText = aiGeneratedCourseText
      .replace(/```json/, '')  // Remove the start of a JSON code block
      .replace(/```/, '')      // Remove the end of a code block
      .trim();                 // Trim any extra whitespace

    // Parse the cleaned response text
    let aiGeneratedCourse;
    try {
      aiGeneratedCourse = JSON.parse(aiGeneratedCourseText);
    } catch (parseError) {
      throw new Error('Error parsing JSON from OpenAI response');
    }

    // Check if the expected properties exist
    if (!aiGeneratedCourse || !aiGeneratedCourse.modules) {
      throw new Error('Unexpected response format from OpenAI');
    }

    const newCourse = new Course({
      user: userId,
      title: aiGeneratedCourse.courseTitle,
      language: language,
      modules: aiGeneratedCourse.modules.map(module => ({
        moduleTitle: module.moduleTitle,
        sections: module.sections.map(section => ({
          sectionTitle: section.sectionTitle,
          body: section.body,
        })),
      })),
    });

    await newCourse.save();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.coursesProgress.push({
      user: userId,
      course: newCourse._id,
      completedSections: [],
      progress: 0,
    });

    await user.save();
    return newCourse;

  } catch (error) {
    console.error('Error generating course:', error); // Log the error
    throw error; // Re-throw to propagate to the controller
  }
};

// const generateCourse = async (userId, language) => {
//   try {
//     const prompt = `Generate a beginner's course to learn ${language} with a course title and a single module containing multiple sections. The output should be in JSON format with the following structure without code block markers:
// {
//   "courseTitle": "string",
//   "module": {
//     "moduleTitle": "string",
//     "sections": [
//       {
//         "sectionTitle": "string",
//         "body": "string"
//       }
//     ]
//   }
// }`;

//     // Make API call to OpenAI v4 chat completions
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "You are an AI that helps in course generation." },
//         { role: "user", content: prompt }
//       ],
//       max_tokens: 1024,
//       temperature: 0.7,
//       top_p: 1.0,
//     });

//     // Extract the response content
//     let aiGeneratedCourseText = aiResponse.choices[0].message.content;

//     // Clean up the response content
//     aiGeneratedCourseText = aiGeneratedCourseText
//       .replace(/```json/, '')  // Remove the start of a JSON code block
//       .replace(/```/, '')      // Remove the end of a code block
//       .trim();                 // Trim any extra whitespace

//     // Parse the cleaned response text
//     let aiGeneratedCourse;
//     try {
//       aiGeneratedCourse = JSON.parse(aiGeneratedCourseText);
//     } catch (parseError) {
//       throw new Error('Error parsing JSON from OpenAI response');
//     }

//     // Check if the expected properties exist
//     if (!aiGeneratedCourse || !aiGeneratedCourse.module) {
//       throw new Error('Unexpected response format from OpenAI');
//     }

//     const newCourse = new Course({
//       user: userId,
//       title: aiGeneratedCourse.courseTitle,
//       language: language,
//       modules: [{
//         moduleTitle: aiGeneratedCourse.module.moduleTitle,
//         sections: aiGeneratedCourse.module.sections.map(section => ({
//           sectionTitle: section.sectionTitle,
//           body: section.body,
//         })),
//       }],
//     });

//     await newCourse.save();

//     const user = await User.findById(userId);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     user.coursesProgress.push({
//       user: userId,
//       course: newCourse._id,
//       completedSections: [],
//       progress: 0,
//     });

//     await user.save();
//     return newCourse;

//   } catch (error) {
//     console.error('Error generating course:', error); // Log the error
//     throw error; // Re-throw to propagate to the controller
//   }
// };

// Get all modules (or courses) for a user
const getAllModules = async (userId) => {
  const course = await Course.findOne({ user: userId });
  return course.modules;
};


const getModuleDetails = async (moduleId) => {
  try {
    // Find the course containing the module with the given ID
    const course = await Course.findById(moduleId.toString());

    if (course) {
      return course.modules; // Return all modules
    } else {
      throw new Error('Course not found');
    }
  } catch (error) {
    console.error('Error fetching module details:', error);
    throw error;
  }
};



module.exports = {
  generateCourse,
  getAllModules,
  getModuleDetails,
  // getAllModules,
  // getModuleDetails,
};
