const isVerbose = !process.env.DISABLE_VERBOSE

const colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  pink: "\x1b[35m",
}

/**
 * Console log that only outputs when VERBOSE environment variable is true
 * @param {string} message - Message to log
 * @param {string} [color] - Color name (e.g., 'cyan', 'blue', 'purple')
 */
export const verboseConsole = (message, color = "") => {
  if (isVerbose) {
    const selectedColor = colors[color.toLowerCase()] || ""
    console.log(`${selectedColor}${message}${colors.reset}`)
  }
}

export default verboseConsole
