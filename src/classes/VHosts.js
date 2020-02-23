const Logger = require("./Logger");
const FileSystem = require("./FileSystem");
const Shell = require("./Shell");

const { CM_PATH_SITES, CM_PATH_VHOSTS } = process.env;
const VHOSTS_CONF = "httpd-vhosts.conf";

class VHosts {
  static includeString(domain) {
    return `Include ${CM_PATH_SITES}/${domain}.vhost`;
  }

  static async exists(domain) {
    const includeString = VHosts.includeString(domain);
    const config = await FileSystem.readFile(CM_PATH_VHOSTS, VHOSTS_CONF);
    return config.indexOf(includeString) > -1;
  }

  static async removeVirtualHost(domain) {
    Logger.status("Removing Virtual Host");
    // const replace = VHosts.includeString(domain).replace(/\//g, "\\/");

    const vhostsFile = FileSystem.resolve(CM_PATH_VHOSTS, VHOSTS_CONF);
    await Shell.exec("sed", ["-i", `''`, `/${domain}/d`, vhostsFile]);
  }

  static async addVhostsConfigFile(domain) {
    Logger.status("Creating Virtual Host Config");
    const templateData = {
      path: CM_PATH_SITES,
      domain,
      domainName: domain.substr(0, domain.length - 5)
    };
    await FileSystem.writeTemplate(
      null,
      `${domain}.vhost`,
      "vhost.conf",
      templateData
    );
  }

  static async updateConfig(domain) {
    if (await VHosts.exists(domain)) {
      Logger.warn("Domain already present in vhosts.conf file. Skipping.");
    }

    Logger.status("Including New Virtual Host");
    await FileSystem.appendFile(
      CM_PATH_VHOSTS,
      VHOSTS_CONF,
      VHosts.includeString(domain)
    );
  }
}

module.exports = VHosts;
