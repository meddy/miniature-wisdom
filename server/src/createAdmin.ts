import readline from "readline";
import db from "./db";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptQuestion = (question: string) =>
  new Promise<string>((resolve) => {
    rl.question(question, (response: string) => {
      resolve(response);
    });
  });

const waitForValidAnswer = async (
  question: string,
  isValid: (answer: string) => boolean
) => {
  while (true) {
    const answer = await promptQuestion(question);
    if (isValid(answer)) {
      return answer;
    }
  }
};

(async () => {
  const user = db
    .prepare("SELECT rowid, * FROM users WHERE is_admin = 1")
    .get();

  if (user) {
    const resetAdmin = await waitForValidAnswer(
      "Reset Admin? y/n: ",
      (answer) => ["y", "n"].includes(answer.toLowerCase())
    );
    if (resetAdmin === "n") {
      rl.close();
      return;
    }
  }

  const username = await waitForValidAnswer("username: ", (answer) =>
    /[a-z_][a-z0-9_]{0,30}/.test(answer)
  );

  const password = await waitForValidAnswer(
    "password: ",
    (answer) => answer.length > 0
  );

  if (user) {
    db.prepare(
      "UPDATE users SET username = ?, password = ? WHERE rowid = ?"
    ).run(username, password, user.rowid);
  } else {
    db.prepare(
      "INSERT INTO users (username, password, is_admin) VALUES (?, ?, TRUE)"
    ).run(username, password);
  }

  rl.close();
})();
