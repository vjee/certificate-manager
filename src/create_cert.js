const FileSystem = require("./classes/FileSystem");
const Prompt = require("./classes/Prompt");
const Shell = require("./classes/Shell");
const VHosts = require("./classes/VHosts");
const Logger = require("./classes/Logger");
const toTitleCase = require("./lib/toTitleCase");

async function run() {
  const domain = await Prompt.ask({
    message: "Choose a domain.",
    type: "list",
    choices: await FileSystem.getSymbolicLinks(),
    filter: domainName => `${domainName}.test`
  });

  const name = await Prompt.ask({
    message: "What's the name of the website?",
    type: "input",
    default: toTitleCase(domain.substring(0, domain.length - 5))
  });

  await FileSystem.writeTemplate(null, `${domain}.ext`, "ext.conf", { domain });
  await Shell.createCertificate(domain, name);
  await VHosts.addVhostsConfigFile(domain);
  await VHosts.updateConfig(domain);
  await Shell.restartApache();
  Logger.info("Done");
}

run().catch(err => {
  console.log(err);
  process.exit(1);
});
