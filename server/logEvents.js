const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    await fsPromises.appendFile(
      path.join(__dirname, logFileName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;
