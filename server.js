const express = require("express");

const app = express();
app.use(express.static(__dirname));

app.listen(Number(process.env.PORT || 4173), () => {
  console.log(`App running on port ${process.env.PORT || 4173}`);
});
