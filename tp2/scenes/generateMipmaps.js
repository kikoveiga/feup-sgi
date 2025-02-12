const sharp = require('sharp');
const path = require('path');

const mipmapCount = process.argv[2] || 7;
const name = "rope"; // Change this to the name of the texture you want to generate mipmaps for
const extension = "jpg"; // Change this to the extension of the texture you want to generate mipmaps for
const originalImage = `textures/${name}.${extension}`;
const outputDir = 'textures/';

function generateMipmaps(imagePath, width, height, level = 0) {
  if (width < 1 || height < 1 || level >= mipmapCount) return;

  const outputFileName = path.join(outputDir, `${name}_mipmap${level}.${extension}`);

  sharp(imagePath)
    .resize(width, height)
    .toFile(outputFileName, (err, info) => {
      if (err) console.error(err);
      else console.log(`Generated ${outputFileName} - ${info.width}x${info.height}`);

      generateMipmaps(imagePath, Math.floor(width / 2), Math.floor(height / 2), level + 1);
    });
}

sharp(originalImage)
  .metadata()
  .then(metadata => {
    const { width, height } = metadata; 
    console.log(`Original image dimensions: ${width}x${height}`);

    generateMipmaps(originalImage, width, height);
  })
  .catch(err => {
    console.error('Error reading image metadata:', err);
  });
