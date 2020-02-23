#!/usr/bin/env node

const Prompt = require("./src/classes/Prompt");

(async () => {
  const CREATE_CERT = "Create Certificate";
  const REMOVE_CERT = "Remove Certificate";
  const CREATE_CA = "Create CA";

  const task = await Prompt.ask({
    message: "What do you want to do?",
    type: "list",
    choices: [CREATE_CERT, REMOVE_CERT, CREATE_CA]
  });

  switch (task) {
    case CREATE_CA:
      require("./src/create_ca");
      break;

    case REMOVE_CERT:
      require("./src/remove_cert");
      break;

    case CREATE_CERT:
      require("./src/create_cert");
      break;
  }
})();
