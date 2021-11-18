const { uploadingFile } = require("./bitbar");

uploadingFile('package.json', {
    username: "E0sOCOAopBygKjmsNT1wKHkf6CmCslE3",
    password: ''
})
.then(res => console.log("-------", JSON.stringify(res)))
.catch(error => console.log("Error;"));