const Shell = require("./classes/Shell");
const Prompt = require("./classes/Prompt");
const Logger = require("./classes/Logger");

async function run() {
  const name = await Prompt.ask({
    message: "What's the name for the new Certificate Authority?",
    type: "input"
  });

  await Shell.createCertificateAuthority(name);
  Logger.info("Done");
}

run().catch(err => {
  console.log(err);
  process.exit(1);
});
