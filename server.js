const url = require('url')
const http = require(`http`);



function getWordCounterReduce(testText) {
    let words = testText.toLowerCase().replace(/[.,\s]/g, ' ').split(' ').filter(String);
    console.log(words);
    return words.reduce((prev, next) => {
        prev[next] = (prev[next] + 1) || 1;
        return prev;
    }, {});
}

// console.log(getWordCounterReduce(string))

function Plural(num, nom, gen, plu) {
    if (num % 10 == 0) {
        return `${num} ${plu}`;
    } else if (num == 1) {
        return `${num} ${nom}`;
    } else if (num % 10 > 10 && num % 10 < 20 || num % 10 == 1) {
        return `${num} ${plu}`;
    } else if (num % 10 >= 2 && num % 10 <= 4) {
        return `${num}  ${gen}`;
    } else if (num % 10 >= 5 && num % 10 <= 10) {
        return `${num} ${plu}`;
    }
    return;
};


// const myObject = url.parse("localhost:3000/plural?number=2&forms=person,people,people", true).query; // { number : '2', forms: 'preson,people,people}
//const string = '/plural?number=2&forms=person,people,people'
//let paramth = string.split('?');
//console.log(paramth[1])


const server = http.createServer((req, res) => {

    const reqUrl = req.url.split('?');
    const pathname = reqUrl[0];
    const query = reqUrl[1];

    if (pathname === '/headers') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end((JSON.stringify(req.headers) + '\n'));
        // curl 'localhost:3000/headers' 

    } else if (pathname === '/plural') {
        const searchParams = new URLSearchParams(query);
        const newforms = searchParams.get('forms').split(",");
        res.writeHead(200, { 'Content-type': 'text/plan' });
        res.end(Plural(`${searchParams.get('number') - 1}`, `${newforms[0]}`, `${newforms[1]}`, `${newforms[2]}`) + '\n');
        // curl 'localhost:3000/plural?number=2&forms=person,people,people'

    } else if (pathname === '/frequency' && req.method === 'POST') {
        // curl -X POST localhost:5000/frequency --data-raw "Little red fox jumps over logs. Fox is red"
        // добавить в ответ 3 заголовка: Content-Type: application/json; количество уникальных слов; самое частое слово.
        let data = "";
        req.on("data", chunk => data += chunk
        )
        req.on("end", () => {
            let greatValue = 0;
            let keyValue = {};
            const input = getWordCounterReduce(data);
            for (let key in input) { //let input = {"fox": 2 ,"is": 1, "jumps": 1, "little": 1,  "logs": 1,  "over": 1,   "red": 2 };
                let next = input[key];
                if (greatValue < next) {
                    greatValue = next;
                    keyValue = key; //console.log(keyValue); // "fox"
                }
            }

            let count = Object.keys(input).length;
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.setHeader("Word count", `${count}`);
            res.setHeader("Most popular word", `${keyValue}`);
            
            res.end(JSON.stringify(input))
        });
    }

    res.writeHead(200, { 404: 'Not found' });

    res.end();

})

const port = 3000
server.listen(port, () => { //call-back сработает сразу после запуска сервера
    console.log(`Server started at localhost:${port}`)
});
