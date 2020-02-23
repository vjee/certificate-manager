const FileSystem = require("./classes/FileSystem");
const Prompt = require("./classes/Prompt");
const Logger = require("./classes/Logger");
const Shell = require("./classes/Shell");
const VHosts = require("./classes/VHosts");

async function run() {
  const domain = await Prompt.ask({
    message: "Choose a domain.",
    type: "list",
    choices: await FileSystem.getSymbolicLinks(),
    filter: domainName => `${domainName}.test`
  });

  await Shell.removeCertificateFiles(domain);
  await VHosts.removeVirtualHost(domain);
  await Shell.restartApache();
  Logger.info("Done");
}

run().catch(err => {
  console.log(err);
  process.exit(1);
});
