const http = require(`http`);
const { url } = require("inspector");

function getWordCounterReduce(testText) {
    let words = testText.toLowerCase().replace(/[.,\s]/g, ' ').split(' ').filter(String);
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

const server = http.createServer((req, res) => {

    const reqUrl = req.url.split('?');

    const pathname = reqUrl[0];
    
    const query = reqUrl[1];

    if (pathname === '/headers') {

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end((JSON.stringify(req.headers) + '\n'));
        // curl 'localhost:3000/headers' 
    }
    if (pathname === '/plural') {

        const searchParams = new URLSearchParams(query);

        const newforms = searchParams.get('forms').split(",");

        res.writeHead(200, { 'Content-type': 'text/plan' });
        res.end(Plural(`${searchParams.get('number')} `,`${newforms[0]}`,`${newforms[1]}`,`${newforms[2]}`) + '\n');
       
        // curl 'localhost:3000/plural?number=2&forms=person,people,people'

    }
    if (pathname === '/frequency') {

            let data = "";
            req.on("data", chunk => {
                data += chunk
            });
            req.on("end", () => {
                const result = getWordCounterReduce(data)
                console.log(result)

                let counter = 0;
                let keyval = {};

                for (let key in result) {
                    let next = result[key];
                    if (counter < next) {
                        counter = next;
                        keyval = key; // "red"
                        console.log(keyval); // "fox"
                    }
                }

                res.setHeader("Most-popular", keyval )
                res.setHeader("Words-counter", Object.keys(result).length)
                res.writeHead(201, { 'Content-type': 'application/json' })

                res.end((JSON.stringify(result)))
            }); // curl localhost:3000/frequency -d "Little red fox jumps over logs. Fox is red"
        } else {
        res.writeHead(404, 'Not found').end();
    }
})

const port = 3000
server.listen(port, () => { //call-back сработает сразу после запуска сервера
    console.log(`Server started at localhost:${port}`)
});
