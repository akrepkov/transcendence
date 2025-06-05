const res = await fetch('/api/greet');
const data = await res.json();
document.body.innerHTML = `<h1>${data.message + "lol" + " xd"}</h1>`;
