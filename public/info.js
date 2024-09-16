const { response } = require("express")

document.getElementById('navbar').addEventListener('click', ()=>{
    fetch('/user')
    .then(response => response.text)
    .then(data =>{
        document.getElementById('message').innerText = data;
    });
});