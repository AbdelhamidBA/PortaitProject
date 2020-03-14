const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello this the first page of Portait Project");
});


module.exports = router;