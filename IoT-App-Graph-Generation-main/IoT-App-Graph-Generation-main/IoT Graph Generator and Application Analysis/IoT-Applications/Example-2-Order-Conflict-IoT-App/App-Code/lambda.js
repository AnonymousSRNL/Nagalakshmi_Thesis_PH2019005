// lambda.js - Lambda-like processing functions
async function createBundle(data) {
    setTimeout(() => {
        console.log(`Bundle created for data: ${data}`);
    }, Math.random() * 2000);
}

async function uploadStr(data) {
    setTimeout(() => {
        console.log(`Data uploaded: ${data}`);
    }, Math.random() * 2000);
}

module.exports = { createBundle, uploadStr };