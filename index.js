(function() {
  // ***********************************************************
  //
  //  isValid()
  //
  // ***********************************************************
  function isValid(v) {
    return (typeof(v) !== 'undefined');
  }
  // ***********************************************************
  //
  //  getLabel()
  //
  //  input:
  //    chap - chapter id
  //    sect - section id
  //
  //  output:
  //    an id string
  //
  //  description:
  //    generate unique id tag
  //
  // ***********************************************************
  function getLabel(chap, sect) {
    var cont = [['chap', chap], ['sect', sect]];
    var res = [];
    $.each(cont, function (i, item) {
      if ( isValid(item[1]) )
        res.push(item.join(''));
    })
    return res.join('');
  }
  // ***********************************************************
  //
  //  makeMenu()
  //
  // ***********************************************************
  function makeMenu(data) {
    var res = [];
    $.each(data, function (i, chap) {
      var item = [];
      if ( isValid(chap.type) ) {
        /* divider */
        if (chap.type === 'divider') {
          var color = chap.color || 'red',
              icon  = chap.icon  || 'book';
          item.push('<a class="header ' + color + ' active item" href="#' + getLabel(i) + '">');
          item.push('<i class="' + icon + ' icon"></i>');
          item.push(chap.name + '</a>');
        }
        /* other */
        else {
          /* section */
          if ( isValid(chap.section) ) {
            item.push('<div class="ui simple dropdown item">');
            /* name */
            if ( isValid(chap.name) ) {
              item.push(chap.name);
              item.push('<i class="dropdown icon"></i>');
            }
            item.push('<div class="menu">');
            $.each(chap.section, function (j, sect) {
              if ( isValid(sect.name) ) {
                item.push('<a href="#' + getLabel(i, j) + '" class="item">');
                item.push(sect.name + '</a>');
              }
            });
            item.push('</div>');
            item.push('</div>');
          }
          else {
            /* name */
            if ( isValid(chap.name) ) {
              item.push('<a class="item" href="#' + getLabel(i) + '">');
              item.push(chap.name);
              item.push('</a>');
            }
          }
        }
      }
      else {
        item.push('<div class="item"><div class="error ui message">' + chap + '</div></div>');
      }
      res.push(item.join(''));
    });
    return res.join('');
  }
  // ***********************************************************
  //
  //  makeBlock()
  //
  // ***********************************************************
  function makeBlock(block) {
    var res = [];
    res.push('<section class="item">');
    /* slide */
    if ( isValid(block.slide) ) {
      res.push('<div class="image">');
      res.push('<a href="' + block.slide + '"><i class="file pdf outline huge icon"></i></a>');
      res.push('</div>');
    }
    /* problems */
    res.push('<div class="content">');
    if ( isValid(block.name) ) {
      res.push('<header class="header">');
      res.push('<h3 class="header-font">' + block.name + '</h3>');
      res.push('</header>');
    }
    if ( isValid(block.prob) ) {
      res.push('<div class="description">');
      var basic = block.prob.basic;
      if ( isValid(basic) ) {
        if ( isValid(basic.uva) ) {
          res.push('<div class="ui segment">');
          res.push('<div class="ui pink top left attached label">UVa</div>');
          res.push('<div class="ui selection list">')
          $.each(basic.uva, function (k, prob) {
            res.push('<div class="item"><div class="header">' + prob + '</div></div>');
          });
          res.push('</div>');
        }
      }
      res.push('</div>');
    }
    res.push('</div>');
    res.push('</section>');
    return res.join('');
  }
  // ***********************************************************
  //
  //  makeSection()
  //
  // ***********************************************************
  function makeSection(sect, i, j) {
    var res = [];
    res.push('<div id="' + getLabel(i, j) + '" class="ui basic segment">');
    if ( isValid(sect.name) ) {
      res.push('<div class="ui blue header">');
      res.push('<h2 class="header-font">');
      res.push('<i class="star icon"></i>');
      res.push(sect.name + '</h2>');
      res.push('</div>');
    }
    if ( isValid(sect.block) ) {
      res.push('<div class="ui divided items">');
      $.each(sect.block, function (k, block) {
        res.push( makeBlock(block) );
      });
      res.push('</div>');
    }
    res.push('</div>');
    return res.join('');
  }
  // ***********************************************************
  //
  //  makeMenu()
  //
  // ***********************************************************
  function makeContent(data) {
    var res = [];
    $.each(data, function (i, chap) {
      var item = [];
      if ( isValid(chap.type) ) {
        if (chap.type !== 'divider') {
          item.push('<section id="' + getLabel(i) + '" class="section content">');
          if ( isValid(chap.name) ) {
            item.push('<header class="ui top attached block header">');
            item.push('<h1 class="header-font">' + chap.name + '</h1>');
            item.push('</header>');
          }
          if ( isValid(chap.section) || isValid(chap.block) ) {
            item.push('<div class="ui bottom attached segment">');
            if ( isValid(chap.block) ) {
              item.push( makeSection({
                'type': 'section',
                'block': chap.block
              }, i, 'R') );
            }
            if ( isValid(chap.section) ) {
              $.each(chap.section, function (j, sect) {
                item.push( makeSection(sect, i, j) );
              });
            }
            item.push('</div>');
          }
          item.push('</section>');
        }
      } 
      else {
        item.push('<div class="item"><div class="error ui message">' + chap + '</div></div>');
      }
      res.push(item.join(''));
    });
    return res.join('');
  }
  // ***********************************************************
  //
  // ***********************************************************
  $.getJSON('config.json', function (data) {
    if (typeof(data) === 'undefined')
      throw 'config.json read error!';
    // menu
    $('#menu').append( makeMenu(data) );
    // content
    $('#content').append( makeContent(data) );
  })
}())