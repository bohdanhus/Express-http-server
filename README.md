# Express-http-server
Написать обработчики запросов#

 /headers - вернуть в ответе все заголовки запроса
 /plural - прочитать query params number и forms и вернуть подходящую форму слова
 /frequency - определить частоту текста в теле запроса и вернуть ее в виде JSON. Добавить в ответ 3 заголовка: Content-Type: application/json; количество уникальных слов; самое частое слово.
 
 
Проверка обработки HTTP запросов#
Проверить обработку запросов можно с помощью утилиты curl.

curl localhost:5000/headers
curl localhost:5000/plural?number=2&forms=person,people,people # попробуйте также передать слова в кириллице сделав url encode
curl -X POST localhost:5000/frequency --data-raw "Little red fox jumps over logs. Fox is red"
