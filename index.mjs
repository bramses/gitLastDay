import moment from "moment";
import { spawn } from "child_process";
import * as dotenv from "dotenv";
dotenv.config();

const OWNER = process.env.OWNER || process.argv[2];
const REPO = process.env.REPO || process.argv[3];
const AUTHOR = process.env.AUTHOR || process.argv[4];

const GH_URL = `https://github.com/${OWNER}/${REPO}/commit/`;

const START_OF_DAY = moment().subtract(1, "days").startOf("day").toString();
const END_OF_DAY = moment().subtract(1, "days").endOf("day").toString();


const createGHURL = (hash) => `${GH_URL}${hash}`;

// get commits from the day
const getCommits = async () => {
  console.log(`Commits from **${START_OF_DAY}** to **${END_OF_DAY}** for **${AUTHOR}** from [**${OWNER}/${REPO}**](${GH_URL.replace('/commit', '')})`);
  const gitLog = spawn("git", [
    "log",
    `--after=${START_OF_DAY}`,
    `--before=${END_OF_DAY}`,
    `--author=${AUTHOR}`
  ]);
  gitLog.stdout.on("data", (data) => {
    const commits = data.toString().split("\n\n\n");
    commits.forEach((commit) => {
      const commitLine = commit.trim().split("\n")[0];
      const hash = commitLine.split(" ")[1];
      const url = createGHURL(hash);
      console.log(url);
    });
  });  
};


getCommits();