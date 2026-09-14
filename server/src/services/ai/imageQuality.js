const sharp = require("sharp");

const calculateBrightness = (pixels) => {
  if (!pixels.length) {
    return 0;
  }

  let total = 0;

  for (let i = 0; i < pixels.length; i++) {
    total += pixels[i];
  }

  return total / pixels.length;
};


const calculateGlareRatio = (pixels) => {
  if (!pixels.length) {
    return 0;
  }

  let brightPixels = 0;

  for (let i = 0; i < pixels.length; i++) {
    if (pixels[i] >= 245) {
      brightPixels++;
    }
  }

  return brightPixels / pixels.length;
};


const calculateLaplacianVariance = (
  pixels,
  width,
  height
) => {
  if (
    width < 3 ||
    height < 3
  ) {
    return 0;
  }

  let sum = 0;
  let sumSquared = 0;
  let count = 0;

  for (
    let y = 1;
    y < height - 1;
    y++
  ) {
    for (
      let x = 1;
      x < width - 1;
      x++
    ) {
      const center =
        pixels[y * width + x];

      const top =
        pixels[(y - 1) * width + x];

      const bottom =
        pixels[(y + 1) * width + x];

      const left =
        pixels[y * width + (x - 1)];

      const right =
        pixels[y * width + (x + 1)];

      const laplacian =
        top +
        bottom +
        left +
        right -
        4 * center;

      sum += laplacian;
      sumSquared +=
        laplacian * laplacian;

      count++;
    }
  }

  if (!count) {
    return 0;
  }

  const mean =
    sum / count;

  return (
    sumSquared / count -
    mean * mean
  );
};


const analyzeImageQuality = async (
  imagePath
) => {
  try {
    console.log(
      "Starting image quality analysis:",
      imagePath
    );

    const metadata =
      await sharp(imagePath)
        .metadata();

    const width =
      metadata.width || 0;

    const height =
      metadata.height || 0;

    if (!width || !height) {
      throw new Error(
        "Unable to read image dimensions."
      );
    }

    const processed =
      await sharp(imagePath)
        .resize({
          width: 512,
          height: 512,
          fit: "inside",
          withoutEnlargement: true,
        })
        .grayscale()
        .raw()
        .toBuffer({
          resolveWithObject: true,
        });

    const pixels =
      processed.data;

    const processedWidth =
      processed.info.width;

    const processedHeight =
      processed.info.height;

    const brightness =
      calculateBrightness(
        pixels
      );

    const glareRatio =
      calculateGlareRatio(
        pixels
      );

    const blurScore =
      calculateLaplacianVariance(
        pixels,
        processedWidth,
        processedHeight
      );


    const resolutionGood =
      width >= 800 &&
      height >= 600;

    const brightnessGood =
      brightness >= 45 &&
      brightness <= 220;

    const glareGood =
      glareRatio < 0.12;

    const blurGood =
      blurScore >= 80;


    let score = 0;

    if (resolutionGood) {
      score += 25;
    }

    if (brightnessGood) {
      score += 25;
    }

    if (glareGood) {
      score += 20;
    }

    if (blurGood) {
      score += 30;
    }


    const issues = [];

    if (!resolutionGood) {
      issues.push(
        "Image resolution is too low."
      );
    }

    if (!brightnessGood) {
      if (brightness < 45) {
        issues.push(
          "Image is too dark."
        );
      }

      if (brightness > 220) {
        issues.push(
          "Image is too bright."
        );
      }
    }

    if (!glareGood) {
      issues.push(
        "Excessive glare detected."
      );
    }

    if (!blurGood) {
      issues.push(
        "Image may be blurry."
      );
    }


    const status =
      score >= 70
        ? "ACCEPT"
        : "RECAPTURE_REQUIRED";


    return {
      success: true,

      quality: {
        score,

        status,

        resolution: {
          width,
          height,
        },

        brightness:
          Number(
            brightness.toFixed(2)
          ),

        glareRatio:
          Number(
            glareRatio.toFixed(4)
          ),

        blurScore:
          Number(
            blurScore.toFixed(2)
          ),

        issues,
      },
    };

  } catch (error) {
    console.error(
      "Image quality analysis failed:",
      error.message
    );

    return {
      success: false,

      quality: {
        score: 0,

        status:
          "RECAPTURE_REQUIRED",

        issues: [
          error.message,
        ],
      },

      error: error.message,
    };
  }
};


module.exports = {
  analyzeImageQuality,
};