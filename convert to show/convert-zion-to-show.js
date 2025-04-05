const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

function convertZionToShow(zionData) {
  if (!zionData || !zionData.songs || !Array.isArray(zionData.songs)) {
    throw new Error("Invalid input format: 'songs' array is missing or not an array.");
  }

  const shows = [];

  zionData.songs.forEach((song) => {
    // Generate unique IDs
    const uniqueId = uuidv4().replace(/-/g, "").slice(0, 12);
    const layoutId = uniqueId.slice(0, 1) + uniqueId.slice(0, 11);
    const slides = {};
    const layoutSlides = [];

    // Create combined name for better searchability
    const combinedName = `${song.Display_Name || ""} | ${song.Search_Name || ""}`;

    // Process content
    let content = song.Content;
    
    // Remove notes sections
    content = content.replace(/<notes>[\s\S]*?<\/notes>/g, '');
    
    // Process chorus tags and create placeholders
    const chorusRegex = /<chorus>([\s\S]*?)<\/chorus>/g;
    const choruses = [];
    let match;
    while ((match = chorusRegex.exec(content)) !== null) {
      choruses.push(match[1].trim());
    }
    
    // Replace chorus tags with placeholders
    let processedContent = content.replace(/<chorus>[\s\S]*?<\/chorus>/g, (match, index) => {
      return `__CHORUS_${choruses.length - 1}__`;
    });
    
    // Split content by double line breaks to get verses
    const sections = processedContent.split(/\r\n\r\n+/)
      .map(section => section.trim())
      .filter(section => section.length > 0);

    // Process each section into slides
    sections.forEach((section) => {
      const slideId = uuidv4().replace(/-/g, "").slice(0, 11); // 11 chars like in example
      
      // Check if this section contains a chorus placeholder
      const chorusMatch = section.match(/__CHORUS_(\d+)__/);
      let slideText, isChorus;
      
      if (chorusMatch) {
        slideText = choruses[parseInt(chorusMatch[1])];
        isChorus = true;
      } else {
        slideText = section;
        isChorus = false;
      }
      
      // Create lines for the slide
      const lines = [];
      slideText.split(/\r\n/).forEach(line => {
        if (!line.trim()) return;
        
        lines.push({
          align: "",
          text: [{
            value: line.trim(),
            style: "font-size: 100px;"
          }]
        });
      });
      
      // Create the slide object
      slides[slideId] = {
        group: isChorus ? "Chorus" : "Verse",
        color: isChorus ? "#f58225" : "#5825f5", // Different color for chorus
        settings: {},
        notes: "",
        items: [{
          type: "text",
          lines: lines,
          style: "top:120px;left:50px;height:840px;width:1820px;",
          align: "",
          auto: false
        }],
        globalGroup: isChorus ? "chorus" : "verse"
      };
      
      layoutSlides.push({ id: slideId });
    });

    // Create the .show file structure
    const show = [
      uniqueId,
      {
        name: combinedName, // Use combined name here for search
        private: false,
        category: "song",
        settings: {
          activeLayout: layoutId,
          template: "default"
        },
        timestamps: {
          created: Date.now(),
          modified: Date.now(),
          used: Date.now()
        },
        quickAccess: {},
        meta: {
          title: combinedName, // Also keep it in title for consistency
          language: song.Language || ""
        },
        slides: slides,
        layouts: {
          [layoutId]: {
            name: "Default",
            notes: "",
            slides: layoutSlides
          }
        },
        media: {}
      }
    ];

    shows.push(show);
  });

  return shows;
}

// Example usage
const inputFile = "zion-songs.json";  // Replace with your input file name
const outputDir = "./converted-shows";

try {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Read and parse the input file
  const data = fs.readFileSync(inputFile, "utf8");
  const zionData = JSON.parse(data);
  
  // Convert to show format
  const shows = convertZionToShow(zionData);
  
  // Save each song as a separate .show file
  shows.forEach((show, index) => {
    const outputFile = `${outputDir}/${show[0]}.show`;
    fs.writeFileSync(outputFile, JSON.stringify(show));
    console.log(`Converted song ${index + 1}/${shows.length}: ${show[1].name}`);
  });
  
  console.log(`\nSuccessfully converted ${shows.length} songs to .show format!`);
  console.log(`Files saved to ${outputDir}/`);
} catch (e) {
  console.error(`Error: ${e.message}`);
}