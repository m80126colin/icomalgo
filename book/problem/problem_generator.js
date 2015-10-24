var makeFileName = function(chap, sect) {
  return chap + '-' + sect + '.tex';
}

var makeProbInfo = function(prob) {
  var oj  = [
    {
      judge: 'UVa',
      href: function (id) {
        var cat = Math.floor(id / 100);
        return 'http://uva.onlinejudge.org/external/' + cat + '/' + id + '.html';
      }
    },
    {
      judge: 'ZJ',
      href: function (id) {
        return 'http://zerojudge.tw/ShowProblem?problemid=' + id;
      }
    },
    {
      judge: 'Ural',
      href: function (id) {
        return 'http://acm.timus.ru/problem.aspx?num=' + id;
      }
    }
  ];
  var ids = [];
  for (var i = 0; i < oj.length; i++) {
    var id = prob[oj[i].judge];
    if (typeof(id) !== 'undefined') {
      var tmp = '\\href{' + oj[i].href(id) + '}{' + id + '}';
      ids.push(oj[i].judge + ' ' + tmp);
    }
  }
  return '\\textbf{\\textit{' + ids.join(' / ') + ': ' + prob.title + '}}';
}

var fs       = require('fs');
var YAML     = require('yamljs');
var probFile = YAML.load('problem.yml');

for (var chap in probFile) {
  var sections = probFile[chap].section;
	for (var i = 0; i < sections.length; i++) {
    var sect = sections[i];
    var file = makeFileName(chap, sect.file);

    var content = [];
    // exercises
    if (typeof(sect.exercises) !== 'undefined') {
      content.push('\\subsubsection*{練習題}');
      content.push('\\begin{itemize}[label={\\Checkmark}]');
      for (var j = 0; j < sect.exercises.length; j++) {
        var prob = sect.exercises[j];
        content.push('\\item ' + makeProbInfo(prob) + '\\\\');
        content.push(prob.discription);
      }
      content.push('\\end{itemize}');
    }
    // others
    if (typeof(sect.others) !== 'undefined') {
      content.push('\\subsubsection*{更多練習題}');
      content.push('\\begin{itemize}[label={\\PencilLeftDown}]');
      for (var j = 0; j < sect.others.length; j++) {
        var prob = sect.others[j];
        content.push('\\item ' + makeProbInfo(prob));
      }
      content.push('\\end{itemize}');
    }

    fs.writeFile(file, content.join('\n'), function (e) {
      if (e) { console.log(e); }
      else { console.log('File saved!'); }
    });
  }
}