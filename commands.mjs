import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const divider =
  "\n_____________________________________________________________________________________________\n";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

// 1️⃣ Prettier list-different
console.log(green + "Checking for unformatted files..." + reset + divider);
let filesToFormat = [];
try {
  const output = execSync(
    "npx prettier . --list-different --ignore-path .prettierignore",
    { encoding: "utf-8" },
  );
  filesToFormat = output.split("\n").filter((f) => f.trim() !== "");
} catch (err) {
  if (err.stdout) {
    filesToFormat = err.stdout.split("\n").filter((f) => f.trim() !== "");
  } else {
    console.error(red, "Error running Prettier check:", err.message, reset);
  }
}

if (filesToFormat.length === 0) {
  console.log(green + "All files are properly formatted!" + reset + divider);
  process.exit(0);
}

// 2️⃣ Group by extension
const grouped = filesToFormat.reduce((acc, file) => {
  const ext = path.extname(file).slice(1) || "no_ext";
  if (!acc[ext]) acc[ext] = [];
  acc[ext].push(file);
  return acc;
}, {});

// 3️⃣ Print files by type
console.log(yellow + "Files that would be formatted:" + reset);
for (const [ext, files] of Object.entries(grouped)) {
  console.log(
    "\n" +
      blue +
      `(${files.length}) ` +
      yellow +
      ext.toUpperCase() +
      ":" +
      reset,
  );
  files.forEach((f) => console.log("  " + f));
}

console.log(
  yellow + `\nFiles need to be formatted: ${filesToFormat.length}\n` + reset,
);

// 4️⃣ Ask user to confirm formatting
async function askToFormat() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "Do you want to run the format now?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ]);

  if (answer.format === "Yes") {
    console.log(reset + "\nRunning Prettier format..." + reset);
    execSync("npx prettier . --write --ignore-path .prettierignore", {
      stdio: "ignore",
    });
    console.log(green + "\nFormatting complete!\n" + divider + reset);
  } else {
    console.log(red + "\nFormat canceled.\n" + divider + reset);
  }
}

askToFormat();
