require("dotenv/config");

const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = process.env.PORT || 4444;
const STATIC_PATH = path.join(__dirname, "static");

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript; charset=UTF-8",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const toBool = [() => true, () => false];

const escape = (filePath) => filePath.replace("..", "").replace("~", "");

const server = http.createServer(async (req, res) => {
    try {
        const { url, method } = req;
        const url_path = `/${url.split("/").splice(2).join("/")}`;
        const paths = [STATIC_PATH, url_path];

        if (method !== "GET") {
            res.statusCode = 404;
            res.end("not found");

            return;
        }

        if (url === "/") {
            paths.push("/index.html");
        }

        const file_path = escape(paths.join(""));
        const ext = path.extname(file_path).substring(1).toLowerCase();
        const exists = await fs.promises.access(file_path).then(...toBool);

        if (exists && ext) {
            res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });

            const stream = fs.createReadStream(file_path);
            stream.pipe(res);

            return;
        }

        res.statusCode = 404;
        res.end("not found");
    } catch (er) {
        console.log(er);

        res.statusCode = 500;
        res.end("oops");
    }
});

server.listen(PORT, () => console.log(`Server has been successfully built and started on port ${PORT}`));
