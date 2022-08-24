import Jetty from "jetty";

function jetty() {
  const j = new Jetty(process.stdout);
  return (text) => {
    j.clear();
    j.moveTo([0, 0]).text(text + "\n");
  };
}

const print = jetty();

export function log(counter, seedCounter) {
  const queue = counter - seedCounter > -1 ? counter - seedCounter - 1 : 0;
  print(`Queue: ${queue}\nAdded: ${seedCounter++}`);
}

export function logWithTimer(counter, seedCounter, before) {
  const queue = counter - seedCounter > -1 ? counter - seedCounter - 1 : 0;
  print(
    `Queue: ${queue}\nAdded: ${seedCounter++}\nSeconds: ${
      (Date.now() - before) / 1000
    }`
  );
}
