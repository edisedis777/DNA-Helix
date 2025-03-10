# DNA Helix Visualization

A dynamic, interactive visualization of a DNA double helix structure with animated background particles, built using CreateJS. This project showcases a side-view representation of DNA with base pairing, designed to be both educational and visually appealing. It is optimized for both desktop and mobile devices.

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

1. **Clone the Repository**:
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
Desktop: View the animation and observe the DNA helix structure with background particles.
Mobile: Swipe left or right to pan the helix horizontally and explore different sections.
Responsive: Resize the browser window or rotate your mobile device to see the layout adapt.

### Files
index.html: Main HTML structure
styles.css: Responsive styling for layout and elements
script.js: Core JavaScript logic using CreateJS for animation and interaction

### Dependencies
CreateJS (loaded via CDN in index.html)

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
Contributions are welcome! Please follow these steps:

Fork the repository
Create a new branch (git checkout -b feature/your-feature)
Commit your changes (git commit -m "Add your feature")
Push to the branch (git push origin feature/your-feature)
Open a Pull Request

### Issues
Found a bug or have a suggestion? Please open an issue with details.

### License
This project is licensed under the MIT License.

### Credits
Built with CreateJS

### Future Improvements
Add zoom functionality for closer inspection
Implement speed controls for the animation
Include educational tooltips for base pairs
Optimize further for low-end devices
