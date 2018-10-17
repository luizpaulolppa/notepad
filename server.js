const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
    res.render("index.html");
});

let message = { };
function getMessage() {
    return message;
}

function setMessage(mess) {
    message = mess;
}

io.on("connection", socket => {
    console.log("Socket conectado -> " + socket.id);

    socket.emit("previousMessages", getMessage());

    socket.on("sendMessage", data => {
        setMessage(data);
        socket.broadcast.emit("receivedMessage", data);
    });
});

server.listen(PORT, () => {
    console.log("OK");
});