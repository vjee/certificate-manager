const chalk = require("chalk");

const { LOG_VERBOSE } = process.env;

class Logger {
  static info(message) {
    console.log(chalk.green(">"), chalk.green(message));
  }

  static status(message) {
    console.log(chalk.cyan(">"), chalk.cyan(message + "..."));
  }

  static warn(message) {
    console.log(chalk.yellow(">"), chalk.yellow(message));
  }

  static command(command) {
    console.log(chalk.magenta("$"), chalk.magenta(command));
  }

  static error(err) {
    if (err) {
      if (!LOG_VERBOSE && (err.message || typeof err === "string")) {
        console.log(chalk.red("ERROR OCCURED"), err.message || err);
      } else {
        console.log(chalk.red("ERROR OCCURED"));
        console.error(err);
      }
    }

    process.exit(1);
  }
}

module.exports = Logger;
