/* FILE NAME: parser.js
 * PROGRAMMER: Fabrika Artem
 * DATE: 13.07.2021
 * PERPOSE: parser and utilits file
 */

var request = require ('request');
var cheerio = require ('cheerio');

/* Word class definition */
class Word
{
  name;
  count;

  /* Class constructor
    ARGUMENTS:
      - name: word from page,
      - count: word`s stats;
  */
  constructor(name, count)
  {
    this.name = name;
    this.count = count;
  }
} /* End of 'Word' class */

var word_array = new Array();

/* Find word in array function
   ARGUMENTS:
     - word: word which found;
   RETURNS:
     - 1 if word found, 0 if didn't.
*/
function findWord(word)
{
  for (var i = 0; i < word_array.length; i++)
  {
    if (word_array[i].name == word)
    {
      word_array[i].count++;
      return 1;
    }
  }
  return 0;
} /* End of 'findWord' function */

/* Sorting words function
   ARGUMENTS:
     - None;
   RETURNS:
     - None.
*/
function sortWord()
{
  word_array.forEach((item, i) => {
    for (let j = i; j < word_array.length; j++)
      if (word_array[i].count < word_array[j].count)
      {
        var tmp = word_array[i];

        word_array[i] = word_array[j];
        word_array[j] = tmp;
      }
    });
}

/* Main parser function
   ARGUMENTS:
     - URL: page link;
     - callback: callback function;
   RETURNS:
     - None.
*/
exports.start = function start(URL, callback)
{
request(URL, function (error, response, html) {
  if (!error && response.statusCode == 200)
  {
    var $ = cheerio.load(html);
    var site_text = new Array();
    var sep_symbs = new Array("\n", "\r", "\t", ",", " ", ";", ":", ""), tmp;

    $('div').each(function(i, element){
      var a = $(this).prev();

      site_text.push(a.text());
    });
    site_text.forEach((item, i) => {
      if (item != "")
      {
        while (item.length >= 0)
        {
          let index = item.indexOf(" ");

          if (index < 0)
            index = item.length;
          if (index <= 0)
            break;
          let word = item.substring(0, index);

          var new_str = item.replace(word + " ", "");
          if (item == new_str)
            word = item, item = "";
          else
            item = new_str;
          tmp = sep_symbs.indexOf(word);
          if (!findWord(word) && tmp == -1)
            word_array.push(new Word(word, 1));
        }
      }
    });
  }
  sortWord();
  callback(word_array);
});

word_array.splice(0, word_array.length);
}

/* END OF 'parser.js' FILE */
