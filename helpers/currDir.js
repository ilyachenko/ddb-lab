import path from "path";
import url from "url";

export default function currDir(fileUrl) {
  const __filename = url.fileURLToPath(fileUrl);
  return path.dirname(__filename);
}
