const chalk = require('chalk');
const log = console.log;

exports.logError = (err, ...args) => {
  log(`${chalk.white.bgRed(' ERROR ')} ${err}\n`, args ? args : '');
}

exports.logWarn = (warn, ...args) => {
  log(`${chalk.black.bgKeyword('orange')(' WARNING ')} ${warn}\n`, args.length ? args : '');
}

exports.logInfo = (info, ...args) => {
  log(`${chalk.white.bgBlue(' INFO ')} ${info}\n`, args.length ? args : '');
}

exports.logSuccess = (success, ...args) => {
  log(`${chalk.black.bgGreen(' SUCCESS ')} ${success}\n`, args.length ? args : '');
}