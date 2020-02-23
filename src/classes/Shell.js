const Execa = require("execa");
const FileSystem = require("./FileSystem");
const Logger = require("./Logger");

class Shell {
  static async exec(command, args, opts, hooks) {
    if (!opts) opts = {};
    if (!hooks) hooks = {};

    opts.all = true;

    Logger.command(`${command} ${args.join(" ")}`);

    const subprocess = Execa(command, args, opts);

    if (hooks.stdin) hooks.stdin(subprocess.stdin);
    if (hooks.stdout) hooks.stdout(subprocess.stdout);
    if (hooks.stderr) hooks.stderr(subprocess.stderr);

    const { stdout } = await subprocess.catch(Logger.error);
    return stdout;
  }

  static async execCommand(command, opts, hooks) {
    if (!opts) opts = {};
    if (!hooks) hooks = {};

    opts.all = true;

    Logger.command(command);

    const subprocess = Execa.command(command, opts);

    if (hooks.stdin) hooks.stdin(subprocess.stdin);
    if (hooks.stdout) hooks.stdout(subprocess.stdout);
    if (hooks.stderr) hooks.stderr(subprocess.stderr);

    const { stdout } = await subprocess.catch(Logger.error);
    return stdout;
  }

  static async removeCertificateFiles(domain) {
    Logger.status("Removing Certificate Files");

    const certificateFiles = ["crt", "csr", "ext", "key", "vhost"];
    await Shell.exec("rm", [
      "-f",
      ...certificateFiles.map(ext =>
        FileSystem.resolve(null, `${domain}.${ext}`)
      )
    ]);
  }

  static async createCertificate(domain, name) {
    const KEY = FileSystem.resolve(null, `${domain}.key`);
    const CSR = FileSystem.resolve(null, `${domain}.csr`);
    const CRT = FileSystem.resolve(null, `${domain}.crt`);
    const EXT = FileSystem.resolve(null, `${domain}.ext`);

    const { CM_PATH_CA, CM_CA_NAME } = process.env;

    const CA_PEM = `${CM_PATH_CA}/${CM_CA_NAME}.pem`;
    const CA_KEY = `${CM_PATH_CA}/${CM_CA_NAME}.key`;

    const subj = {
      C: "BE",
      ST: "Limburg",
      L: "Maasmechelen",
      O: name,
      CN: domain
    };

    const subjString = Object.keys(subj)
      .map(key => `/${key}=${subj[key]}`)
      .join("");

    Logger.status("Creating Certificate");

    // prettier-ignore
    await Shell.exec("openssl", [ "genrsa", "-out", KEY, "2048" ]);
    // prettier-ignore
    await Shell.exec("openssl", [ "req", "-new", "-key", KEY, "-out", CSR, "-subj", subjString ]);
    // prettier-ignore
    await Shell.exec("openssl", [ "x509", "-req", "-in", CSR, "-CA", CA_PEM, "-CAkey", CA_KEY, "-CAcreateserial", "-out", CRT, "-days", "365", "-sha256", "-extfile", EXT 
    ]);
  }

  static async createCertificateAuthority(name) {
    const { CM_PATH_CA } = process.env;

    const CA_KEY = `${CM_PATH_CA}/${name}.key`;
    const CA_PEM = `${CM_PATH_CA}/${name}.pem`;

    Logger.status("Generating Private Key");
    // prettier-ignore
    await Shell.exec("openssl", [ "genrsa", "-des3", "-out", CA_KEY, "2048" ]);

    Logger.status("Generating Root Certificate");
    // prettier-ignore
    await Shell.exec("openssl", [ "req", "-x509", "-new", "-nodes", "-key", CA_KEY, "-sha256", "-days", "1825", "-out", CA_PEM ], {
      stdio: [process.stdin, process.stdout, process.stderr]
    });

    Logger.status("Adding Root Certificate to KeyChain");
    // prettier-ignore
    await Shell.exec("sudo", [ "security", "add-trusted-cert", "-d", "-k", "/Library/Keychains/System.keychain", CA_PEM ]);
  }

  static async restartApache() {
    Logger.status("Restarting Apache");
    await Shell.exec("sudo", ["apachectl", "-k", "restart"]);
  }
}

module.exports = Shell;
