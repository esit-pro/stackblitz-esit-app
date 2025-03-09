// For Node.js environments
const fs = require('fs');
const path = require('path');

/**
 * Prints the directory structure starting from the specified root directory
 * @param {string} dir - The directory to start from
 * @param {number} depth - The current depth level (used for indentation)
 * @param {number} maxDepth - Maximum depth to traverse
 * @param {Array<string>} ignore - Array of directory/file names to ignore
 */
function printDirectoryStructure(
  dir,
  depth = 0,
  maxDepth = 10,
  ignore = ['.git', 'node_modules', '.next', 'dist', 'build']
) {
  if (depth > maxDepth) return;

  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      if (ignore.includes(file)) return;

      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      // Print with proper indentation
      console.log(
        '  '.repeat(depth) + (stats.isDirectory() ? '📁 ' : '📄 ') + file
      );

      // Recursively print subdirectories
      if (stats.isDirectory()) {
        printDirectoryStructure(filePath, depth + 1, maxDepth, ignore);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

// Usage: Run this script from your project's root directory
const rootDir = process.argv[2] || '.'; // Use command line argument or current directory
console.log(`📁 Directory structure for ${path.resolve(rootDir)}:\n`);
printDirectoryStructure(rootDir);

// To run: node print-directory.js [optional-directory-path]
