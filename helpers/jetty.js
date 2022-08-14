import Jetty from "jetty";

export default function jetty() {
  const j = new Jetty(process.stdout);
  return (text) => {
    j.clear();
    j.moveTo([0, 0]).text(text + "\n");
  };
}
