// prettier.config.js
export default {
  // Core formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",

  // Trailing commas for better git diffs
  trailingComma: "es5",

  // Bracket formatting
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow function parentheses
  arrowParens: "avoid",

  // Prose formatting (for markdown)
  proseWrap: "preserve",

  // HTML/JSX (if you add React examples later)
  htmlWhitespaceSensitivity: "css",

  // End of line handling
  endOfLine: "lf",

  // File-specific overrides
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 70,
        proseWrap: "always",
      },
    },
    {
      files: "*.json",
      options: {
        printWidth: 120,
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
