import { EOL } from "os";
import * as d3 from "d3-dsv";

export default class LineParser {
  setColumn(columns) {
    this.columns = columns;
  }

  parse(line) {
    const strToParse = `${this.columns}${EOL}${line}`;
    return d3.tsvParse(strToParse).filter((d, i) => i !== "columns")[0];
  }
}
