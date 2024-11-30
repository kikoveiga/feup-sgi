const sharp = require('sharp');
const path = require('path');

const mipmapCount = process.argv[2] || 7; // Number of mipmaps to generate (1 to 7)
const originalImage = 'textures/rope.jpg'; // Path to your original image
const outputDir = 'textures/';

// Function to generate mipmaps recursively
function generateMipmaps(imagePath, width, height, level = 0) {
  // If width or height is less than 1 or we've reached the desired number of mipmaps, stop
  if (width < 1 || height < 1 || level >= mipmapCount) return;

  const outputFileName = path.join(outputDir, `rope_mipmap${level}.jpg`);

  // Resize and save mipmap
  sharp(imagePath)
    .resize(width, height)
    .toFile(outputFileName, (err, info) => {
      if (err) console.error(err);
      else console.log(`Generated ${outputFileName} - ${info.width}x${info.height}`);

      // Recursively generate the next mipmap
      generateMipmaps(imagePath, Math.floor(width / 2), Math.floor(height / 2), level + 1);
    });
}

// Read the image to get its dimensions automatically
sharp(originalImage)
  .metadata()
  .then(metadata => {
    const { width, height } = metadata; // Extract the width and height from the metadata
    console.log(`Original image dimensions: ${width}x${height}`);

    // Start generating mipmaps from the original image's size
    generateMipmaps(originalImage, width, height);
  })
  .catch(err => {
    console.error('Error reading image metadata:', err);
  });
