const { startBitbarTesting } = require("./bitbar")


startBitbarTesting(
    { username: "E0sOCOAopBygKjmsNT1wKHkf6CmCslE3", password: "" },
    "ANDROID",
    148552865,
    148554220,
    207081202,
    541,
    45971
).then(res => {
    console.log("Done!", res);
}).catch(error => {
    const { response } = error;
    if (response) console.log("Error:", response.data);
})