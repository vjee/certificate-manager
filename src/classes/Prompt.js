const inquirer = require("inquirer");

class Prompt {
  static async ask(question) {
    if (!question.name) question.name = Symbol();
    const answer = await inquirer.prompt(question);
    return answer[question.name];
  }
}

module.exports = Prompt;
