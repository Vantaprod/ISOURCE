import { setServers } from "node:dns";
setServers(["8.8.8.8"]);
console.log("[dns] using 8.8.8.8");

(async () => {
  await import("./seed-placements");
})();
