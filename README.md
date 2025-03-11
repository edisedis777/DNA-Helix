# DNA Helix Visualization
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
![CreateJS](https://img.shields.io/badge/CreateJS-JavaScript%20Library-0082C9?logo=javascript&logoColor=white)
[![Markdown](https://img.shields.io/badge/Markdown-%23000000.svg?logo=markdown&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A dynamic, interactive visualization of a DNA double helix structure with animated background particles, built using CreateJS. It's optimized for both desktop and mobile devices.

![DNA Helix Visualization](https://github.com/user-attachments/assets/88e9d14e-d4ac-4632-bc89-7482eaeb471c)

## Demo
Try it live: [HERE](https://edisedis777.github.io/DNA-Helix/)

## Features

- **Interactive DNA Helix**: Side-view animation of a DNA double helix with accurate base pairing (A-T, C-G).
- **Base Pair Connections**: Subtle lines connecting complementary base pairs for clarity.
- **Animated Background**: Dynamic particle system with varied movement and hues, enhancing the visual depth.
- **Responsive Design**: Adapts seamlessly to different screen sizes and orientations.
- **Mobile Optimization**: Touch controls for panning on mobile devices, reduced particle count, and lower framerate for performance.
- **Legend**: Color-coded guide for nucleobases (Adenine, Cytosine, Guanine, Thymine, Uracil).
- **Title**: Clear "DNA Helix Visualization" header for context.


## Installation

Clone the Repository:
   ```bash
   git clone https://github.com/[your-username]/dna-helix-visualization.git
   cd dna-helix-visualization
   ```

Serve the Files: 
Since this is a static web project, you can serve it using a simple HTTP server. 

For example, with Python:
  ```bash
  Copy
  python -m http.server 8000
  ```

Or with Node.js (using http-server):
```
npm install -g http-server
http-server
```

Open in Browser: Navigate to http://localhost:8000 (or the port specified by your server) in your web browser.

### Usage
- Desktop: View the animation and observe the DNA helix structure with background particles.
- Mobile: Swipe left or right to pan the helix horizontally and explore different sections.
- Responsive: Resize the browser window or rotate your mobile device to see the layout adapt.

### Files
- index.html: Main HTML structure
- styles.css: Responsive styling for layout and elements
- script.js: Core JavaScript logic using CreateJS for animation and interaction

### Dependencies
- CreateJS (loaded via CDN in index.html)

### Project Structure

```
Copy
dna-helix-visualization/
├── index.html         # Main HTML file
├── styles.css         # Stylesheet with responsive design
├── script.js          # JavaScript logic and animation
└── README.md          # This file
```

### Contributing
- Contributions are welcome!

### Issues
- Found a bug or have a suggestion? Please open an issue with details.

### License
This project is licensed under the MIT License.

### Credits
Built with CreateJS

### Future Plans
- Add zoom functionality for closer inspection
- Implement speed controls for the animation
- Include educational tooltips for base pairs
- Optimize further for low-end devices
