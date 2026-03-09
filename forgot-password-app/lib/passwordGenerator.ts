const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const ALL_CHARS = UPPERCASE + LOWERCASE;

export function generatePassword(length: number = 12): string {
  let password = "";

  // Ensure at least 1 uppercase and 1 lowercase
  password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];

  // Fill the rest randomly from all chars
  for (let i = 2; i < length; i++) {
    password += ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
  }

  // Shuffle so uppercase/lowercase aren't always at start
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
