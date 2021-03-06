---
---

/*
 * Author : Ho-Seok Ee <hsee@korea.ac.kr>
 * Release: 2006/07/14
 * Update : 2011/01/22

 Copyright (C) Ho-Seok Ee <hsee@korea.ac.kr>. All rights reserved.

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 2 of
  the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  The license can be found at http://www.gnu.org/licenses/gpl.txt.
 */

var EN_type = 'qwerty';
var KO_type = '3shin-p2';
var KE_status = 'ko';// en, ko

// 두벌식 code, offset, code, offset, code, offset
//          홑닿소리, 값차이, ......
// 세벌식 dCode, sCode, dCode, sCode, dCode, sCode
//            겹소리, 겹소리가 되기 전의 것 ohiQ[1] = ohiQ[0], ........
//  세벌식에서는 앞낱자와 들어온 낱자가 조합이 되는 것이라면
//  앞낱자가 있던 자리에 조합된 낱자를 넣고
//  두벌식의 offset 값을 넣는 자리에 앞낱자를 넣어둔다 ohiQ[1] = ohiQ[0]
//  backspace 처리시에 조합낱자를 지우고 offset 자리에 넣어둔 앞낱자를
//  다시 앞자리로 옮겨준다 ohiQ[0] = ohiQ[1]
const OHIQ_INIT = [0,0,0,0,0,0];
var ohiQ = OHIQ_INIT;

// 옛한글을 조합할 때,
// 낱자가 더해질 때는 앞선 preedit 의 낱자가 하나 적으니 -1
// 낱자가 빠질 때는 앞선 preedit 의 낱자가 하나 많으니 1
// 낱자가 조합이 될 때는 0
var fore_back = -1;

var layout_list_info_ke = [
  {name: 'en', full_name: '영문'},
  {name: 'ko', full_name: '한글'}
];

var layout_list_info_en = [
  {name: 'qwerty', full_name: 'Qwerty'},
  {name: 'dvorak', full_name: 'Dvorak'},
  {name: 'colemak', full_name: 'Colemak'}
];

var layout_list_info_ko = [
  {name: '2-ksx5002', full_name: '한국 표준 (KSX 5002)',
    position: "머리"
  },
  {name: '2-kps9256', full_name: '조선 국규 (KPS 9256)',
    position: "머리"
  },
  {name: '2sun-ksx5002', full_name: '순아래 (꼬마집오리)',
    position: "팔",
    link: 'http://blog.daum.net/tinyduck/2111486'
  },
  {name: '3-90', full_name: '3-90',
    position: "팔",
    left_bracket_araea: true
  },
  {name: '3-91', full_name: '3-91 (공병우 최종)',
    position: "머리",
  },
  {name: '3-93-yet', full_name: '3-93 옛한글',
    position: "허리",
    link: 'http://asadal.pnu.kr/data/data_002_006.html'
  },
  {name: '3-2012', full_name: '3-2012',
    position: "다리",
    left_bracket_araea: true,
    extension_sign_keys: [0, 'v', '8'], // 0:같은 기호 배열
    link: 'http://pat.im/938'
  },
  {name: '3-2012-yet', full_name: '3-2012 옛한글',
    position: "허리",
    left_bracket_araea: true,
    extension_sign_keys: [1, '/', '9'], //  1:다른 기호 배열
    extension_yetgeul_keys: [1, '7', '8'], //  1:다른 기호 배열
    link: 'http://pat.im/938#4-2'
  },
  {name: '3-2015', full_name: '3-2015',
    position: "팔",
    right_ou_keys: ['/', '9'],
    galmadeuli: true,
    link: 'http://sebeol.org/3-2015.html'
  },
  //{name: '3-2015-yet', full_name: '3-2015 옛한글',
    //link: 'http://cafe.daum.net/3bulsik/JMKX/36'
  //},
  {name: '3-2015p', full_name: '3-2015P',
    position: "다리",
    right_ou_keys: ['/', '9'],
    left_bracket_araea: true,
    galmadeuli: true,
    extension_sign_keys: [1, '/', '9'], //  1:다른 기호 배열
    link: 'http://pat.im/1090'
  },
  {name: '3-2015p-yet', full_name: '3-2015P 옛한글',
    position: "허리",
    right_ou_keys: ['/', '9'],
    left_bracket_araea: true,
    extension_sign_keys: [1, '/', '9'], //  1:다른 기호 배열
    extension_yetgeul_keys: [1, '7', '8'], //  1:다른 기호 배열
    link: 'http://pat.im/1090'
  },
  {name: '3-p2', full_name: '3-P2',
    position: "다리",
    right_ou_keys: ['8', '/', '9'],
    left_bracket_araea: true,
    galmadeuli: true,
    extension_sign_keys: [1, '/', '9'], //  1:다른 기호 배열
    link: 'http://pat.im/1128'
  },
  {name: '3-p3', full_name: '3-P3',
    position: "머리",
    right_ou_keys: ['8', '/', '9'],
    left_bracket_araea: true,
    galmadeuli: true,
    extension_sign_keys: [1, '/', '9'], //  1:다른 기호 배열
    link: 'http://pat.im/1128'
  },
  {name: '3sun-1990', full_name: '순아래 1990',
    position: "다리"
  },
  {name: '3sun-2014', full_name: '순아래 2014',
    position: "팔",
    link: 'http://cafe.daum.net/3bulsik/JMKX/18'
  },
  {name: '3moa-ahn', full_name: '안마태 소리글판',
    position: "팔",
    link: 'http://ahnmatae.org'
  },
  {name: '3moa-semoe-2014', full_name: '세모이 2014',
    position: "다리",
    right_ou_keys: ['p', '\''],
    galmadeuli: true,
    link: 'http://ssg.wo.tc/220239514856'
  },
  {name: '3moa-semoe-2015', full_name: '세모이 2015',
    position: "다리",
    right_ou_keys: ['p', '\''],
    galmadeuli: true,
    link: 'http://ssg.wo.tc/220239514856'
  },
    {name: '3moa-semoe-2016', full_name: '세모이 2016',
    position: "다리",
    right_ou_keys: ['p', '['],
    galmadeuli: true,
    extension_sign_keys: ['J', 'K', 'L', ':'],
    shortening : true,
    link: 'http://ssg.wo.tc/220239514856'
  },
    {name: '3moa-semoe-2017', full_name: '세모이',
    position: "머리",
    right_ou_keys: ['p', '.'],
    galmadeuli: true,
    extension_sign_keys: ['J', 'K', 'L', ':'],
    shortening : true,
    link: 'http://ssg.wo.tc/220239514856'
  },
  {name: '3shin-1995', full_name: '신세벌식 1995 (신광조)',
    position: "다리",
    right_ou_keys: ['I', 'O', 'P'],
    galmadeuli: true
  },
  {name: '3shin-b', full_name: '신세벌식 박경남',
    position: "다리",
    right_ou_keys: ['O', 'P'],
    galmadeuli: true
  },
  {name: '3shin-2003', full_name: '신세벌식 박경남 수정 (2003)',
    position: "팔",
    right_ou_keys: ['O', 'P'],
    left_bracket_araea: true,
    galmadeuli: false,
    extension_sign_keys: [0x110B/*ㅇ*/, 'k', 'l', ';']
  },
  {name: '3shin-2012', full_name: '신세벌식 2012',
    position: "다리",
    right_ou_keys: ['O', 'P'],
    left_bracket_araea: true,
    galmadeuli: true,
    extension_sign_keys: [0x110B/*ㅇ*/, 'k', 'l', ';'],
    link: 'http://pat.im/978'
  },
  {name: '3shin-2015-shift', full_name: '신세벌식 2015',
    position: "팔",
    right_ou_keys: ['O', 'P'],
    galmadeuli: true,
    link: 'http://sebeol.org/gnuboard/bbs/board.php?bo_table=lab&wr_id=28'
  },
  {name: '3shin-m-shift', full_name: '신세벌식 M',
    position: "팔",
    right_ou_keys: ['O', 'P'],
    galmadeuli: true,
    link: 'http://cafe.daum.net/3bulsik/JMKX/77'
  },
  {name: '3shin-p1', full_name: '신세벌식 P',
    position: "팔",
    right_ou_keys: ['I', 'O', 'P'],
    galmadeuli: true,
    extension_sign_keys: [0x110B/*ㅇ*/, 'k', 'l', ';'],
    link: 'http://pat.im/1110'
  },
    {name: '3shin-p2', full_name: '신세벌식 P2',
    position: "머리",
    right_ou_keys: ['I', 'O', 'P'],
    galmadeuli: true,
    extension_sign_keys: [0x110B/*ㅇ*/, 'k', 'l', ';'],
    link: 'http://pat.im/1136'
  },
];

// 갈마들이를 html 에 보여줄 때 오른손 글쇠에 왼손 글쇠와 값이 같은 것이 있을 때
// 갈마들이 값이 나타나는데 이것을 막고자 나타내지 말아야하는 글쇠를 나열한다.
// set_basic_table() 에서 갈마들이를 넣을 때 값을 비워두기 위해서 쓴다
// 이름은 keyboard_mapping_layout_html.js 의 첫째값들을 쓴다
var galmadeuli_no_display_keys = [
  'key_nine', 'key_y', 'key_u', 'key_i', 'key_o', 'key_p',
  'key_forwardslash', 'key_semicolon', 'key_apostrophe',
  'key_left_bracket'
];

var compatibility_hot = [
  /*ㄱ*/0x3131,/*ㄴ*/0x3134,/*ㄷ*/0x3137,
  /*ㄹ*/0x3139,/*ㅁ*/0x3141,/*ㅂ*/0x3142,
  /*ㅅ*/0x3145,/*ㅇ*/0x3147,/*ㅈ*/0x3148,
  /*ㅊ*/0x314A,/*ㅋ*/0x314B,/*ㅌ*/0x314C,
  /*ㅍ*/0x314D,/*ㅎ*/0x314E
];

// ASCII 0x21 (33) 부터 시작해서 제 값을 얻으려면 33 을 빼줘야 한다
var english_layout = [];
var hangeul_layout = [];
var hangeul_combination = [];
var right_ou_keys = [];
var left_bracket_araea = false;
var html_map_layout = [];
var galmadeuli_layout = [];
var extension_steps = 0;
var extension_pressed_key = 0;
var extension_sign_keys = [];
var extension_sign_layout = [];
var extension_yetgeul_keys = [];
var extension_yetgeul_layout = [];
var shortening = false;
var shortening_action = 0;
var shortening_hangeul_keys = [];
var shortening_english_keys = [];
var shortening_layout = {};


var shift_on = false;
var caps_lock_on = false;// 아직 안 했다
var right_oua = false;
// 모아치기 글판의 글자 조합 종료 타이머
//var ohi_timeout = 0;
var pressing_keys = 0;
var shoot_at_once = false;
var tadak_tadak = false;
// 요즘한글 글판에서 옛한글을 넣을 수 있도록 한다
// 적용: 신세벌식 P,
var yet_hangeul = false;
var focus_tag_id = "inputText";

//browser_detect()
var browser = '';
var browser_ver = 0;
var nu = navigator.userAgent;

function browser_detect() {
  var trident=navigator.userAgent.match(/Trident\/(\d\.\d)/i);
  var trident_ver = trident==undefined || !trident ? 0 : parseFloat(trident[1]);
  if(nu.indexOf('MSIE')>=0 || trident_ver>=7) {
    browser = "MSIE";
    if(trident_ver<7) {
      browser_ver = parseFloat(nu.substring(nu.indexOf("MSIE ")+5));
    }
    else if(trident_ver==7) {
      browser_ver=11;
    }
  }
  else if(nu.indexOf('Firefox') != -1) {
    browser = "Firefox";
    browser_ver = parseFloat(nu.substring(nu.indexOf('Firefox/')+8));
  }
  else if(nu.indexOf('Chrome') != -1) {
    browser = "Chrome";
    browser_ver = parseFloat(nu.substring(nu.indexOf('Chrome/')+7));
  }
}

// backspace 글쇠를 누르지 않았을 때에 backspace 동작을 하게 함
function ohi_html_Backspace () {
  var focus = inputText_focus();

  if (document.selection && browser == 'MSIE' && browser_ver < 9) {
    var selection = document.selection.createRange ();
    var text = selection.text;
    selection.moveStart ('character', -focus.value.length);
    var pos = selection.text.length;
    if (focus.setSelectionRange) {
      focus.setSelectionRange (pos - 1, pos);
      focus.text='';
    } else if (focus.createTextRange) {
      var range = focus.createTextRange ();
      range.collapse (true);
      range.moveEnd ('character', pos);
      range.moveStart ('character', pos - 1);
      range.select ();
      range.text = '';
    }
  } else {
    var bs_start = focus.selectionStart;
    var bs_end = focus.selectionEnd;
    if (bs_start == bs_end) {
      focus.value = focus.value.substr (0, bs_start - 1)+focus.value.substr (bs_end);
      focus.selectionStart = focus.selectionEnd = bs_start - 1;
    } else {
      focus.value = focus.value.substr (0, bs_start)+focus.value.substr (bs_end);
      focus.selectionStart = focus.selectionEnd = bs_start;
    }
  }
}

function ohi_Backspace (__shortening_exe) {
  __shortening_exe = typeof(__shortening_exe != 'undefined') ? __shortening_exe : false;
  if (shoot_at_once && (ohiQ != OHIQ_INIT)) {
    ohi_Insert(0, ohiQ = OHIQ_INIT);
  } else if(ohiQ[0] || ohiQ[1] || ohiQ[2] || ohiQ[3]) {
    var last = 0;
    for(var index in ohiQ) {
      if (ohiQ[index]) {
        //ohiQ[0,1,2,3,4,5]에서 낱자가 들어있는 마지막 값을 찾는다
        last = index;
      }
      // 옛한글이 있다
      if (is_cheot_gawit_ggeut(ohiQ[index]) & 0x08) {
        fore_back = 1;
      }
    }
    if ( (last & 0x01) && (ohiQ[last] >= 0x1100) ) {
      // 마지막 index 가 1,3,5 이고 그 자리에 [표준 자모]가 있다
      // 즉, 0,2,4 자리에 겹소리, 1,3,5 자리에 겹소리가 되기 전의 홑소리가 있을 때
      ohiQ[last - 1] = ohiQ[last];
      ohiQ[last] = 0;
      fore_back = 0;
    } else {
      ohiQ[last] = 0;
    }
    ohi_Insert(0, ohiQ);
  } else {
    ohi_html_Backspace();
    if (__shortening_exe) {
    } else {
      if (shortening_action > 0) {
        for (;shortening_action-- > 1;) {
          ohi_html_Backspace ();
        }
      }
      shortening_action = 0;
      shortening_english_keys = [];
      shortening_hangeul_keys = [];
    }
  }
}

// 갈마들이에 쓰이는 배열에서 이진검색을 하여 값을 알아낸다
// 배열은 반드시 /**오름차순**/으로 정렬이 되어 있어야 한다.
// http://oli.me.uk/2014/12/17/revisiting-searching-javascript-arrays-with-a-binary-search/
/**
 * Performs a binary search on the provided sorted list and
 * returns the index of the item if found.
 * If it can't be found it'll return -1.
 *
 * @param {*[]} list Items to search through.
 * @param {*} item The item to look for.
 * @return {Number} The index of the item if found, -1 if not.
 */
function binarySearch(list, item) {
  var min = 0;
  var max = list.length - 1;
  var guess;

  while (min <= max) {
    guess = Math.floor((min + max) / 2);

    if (list[guess][0] == item) {
      return guess;
    } else {
      if (list[guess][0] < item) {
        min = guess + 1;
      } else {
        max = guess - 1;
      }
    }
  }

  return -1;
}

// Object Array 에서 index 를 찾는다
function findIndexByKeyValue (arraytosearch, key, valuetosearch) {
  for (var i in arraytosearch) {
    if (arraytosearch[i][key] == valuetosearch) {
      return i;
    }
  }
  return null;
}

// 한글 낱자를 호환용으로 바꾼다 // 옛한글은 아직 넣지 않았다
// 호환 자모로 바꾸지 못하면 받은 값을 돌려준다
function jamo_to_compatibility(charCode) {
  if(charCode>=0x1100 && charCode<=0x1112) {// 첫소리
    if(charCode>=0x1109) {// ㅅ [148] 부터 1 ㅄ
      charCode = charCode + 0x2031 + 11; // 첫소리 ㅅ 을 0x3145 로 만든다
    } else if(charCode>=0x1106) {// ㅁ [144] 부터 7 ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ
      charCode = charCode + 0x2031 + 10; // 첫소리 ㅁ 을 0x3141 로 만든다
    } else if(charCode>=0x1103) {// ㄷ [134] 부터 2 ㄵ ㄶ
      charCode = charCode + 0x2031 + 3; // 첫소리 ㄷ 을 0x3137 로 만든다
    } else if(charCode>=0x1102) {// ㄴ [131] 부터 1 ㄳ
      charCode = charCode + 0x2031 + 1; // 첫소리 ㄴ 을 0x3134 로 만든다
    } else {
      charCode = charCode + 0x2031; // 첫소리 ㄱ 을 0x3131 로 만든다
    }
  } else if (charCode>=0x1161 && charCode<=0x1175) {// 가윗소리
    charCode = charCode + 0x1FEE; // 가윗소리 ㅏ 를 31 로 만든다
  } else if (charCode>=0x11A8 && charCode<=0x11C2) {// 끝소리
    if(charCode>=0x11BE) {// ㅊ 부터 1 ㅉ
      charCode = charCode + 0x1F89 + 3; // 끝소리 ㅄ 을 0x3144 로 만든다
    } else if(charCode>=0x11B9) {// ㅄ 부터 1 ㅃ
      charCode = charCode + 0x1F89 + 2; // 끝소리 ㅄ 을 0x3144 로 만든다
    } else if(charCode>=0x11AF) {// ㄹ 부터 1 ㄸ
      charCode = charCode + 0x1F89 + 1; // 끝소리 ㄹ 을 0x3139 로 만든다
    } else {
      charCode = charCode + 0x1F89; // 끝소리 ㄱ 을 1 로 만든다
    }
  } else if (charCode>0x1112 && charCode<0x115F) {// 옛한글 첫소리
    //return charCode;
  } else if (charCode>0x1175 && charCode<0x11A8) {// 옛한글 가윗소리
    if (charCode = 0x119E) {
      charCode = 0x318D;
    }
    //return charCode;
  } else if (charCode>0x11C2 && charCode<=0x11FF) {// 옛한글 끝소리
    //return charCode;
  } else {
    return charCode;
  }
  return charCode;
}

//있던것과 들어온 것의 값의 차를 돌려준다
//a:첫가끝을 정한다, exist: 있던것, charCode: 들어온것
function ohi_Double_Jamo(a, exist, charCode) {
  var offset;
  var base;
  if (charCode > 0x3130) {
    base = [
      // 호환자모 겹닿소리, 겹홀소리
      // Cho
      [ [0x3131/*ㄱ*/, 0x3137/*ㄷ*/, 0x3142/*ㅂ*/, 0x3145/*ㅅ*/, 0x3148/*ㅈ*/],
        [0x3131/*ㄱ*/],
        [0x3137/*ㄷ*/],
        [0x3142/*ㅂ*/],
        [0x3145/*ㅅ*/],
        [0x3148/*ㅈ*/]
      ],
      // Jung
      [ [0x3157/*ㅗ*/, 0x315C/*ㅜ*/, 0x3161/*ㅡ*/],
        [0x314F/*ㅏ*/, 0x3150/*ㅐ*/, 0x3163/*ㅣ*/],
        [0x3153/*ㅓ*/, 0x3154/*ㅔ*/, 0x3163/*ㅣ*/],
        [0x3163/*ㅣ*/]
      ],
      // Jong
      [ [0x3131/*ㄱ*/, 0x3134/*ㄴ*/, 0x3139/*ㄹ*/, 0x3142/*ㅂ*/, 0x3145/*ㅅ*/],
        [0x3131/*ㄱ*/, 0x3145/*ㅅ*/],
        [0x3148/*ㅈ*/, 0x314E/*ㅎ*/],
        [0x3131/*ㄱ*/, 0x3141/*ㅁ*/, 0x3142/*ㅂ*/, 0x3145/*ㅅ*/, 0x314C/*ㅌ*/, 0x314D/*ㅍ*/, 0x314E/*ㅎ*/],
        [0x0000/*ㅂ*/, 0x3145/*ㅅ*/],
        [0x3145/*ㅅ*/]
      ]
    ][a];
  } else {
    // hangeul_combination 을 쓰게되면서 이 것은 쓸모가 없어졌지만 그냥 둔다
    base = [
      // 표준자모 겹닿소리, 겹홀소리
      // Cho
      [ [0x1100/*ㄱ*/, 0x1103/*ㄷ*/, 0x1107/*ㅂ*/, 0x1109/*ㅅ*/, 0x110C/*ㅈ*/],
        [0x1100/*ㄱ*/],
        [0x1103/*ㄷ*/],
        [0x1107/*ㅂ*/],
        [0x1109/*ㅅ*/],
        [0x110C/*ㅈ*/]
      ],
      // Jung
      [ [0x1169/*ㅗ*/, 0x116E/*ㅜ*/, 0x1173/*ㅡ*/],
        [0x1161/*ㅏ*/, 0x1162/*ㅐ*/, 0x1175/*ㅣ*/],
        [0x1165/*ㅓ*/, 0x1166/*ㅔ*/, 0x1175/*ㅣ*/],
        [0x1175/*ㅣ*/]
      ],
      // Jong
      [ [0x11A8/*ㄱ*/, 0x11AB/*ㄴ*/, 0x11AF/*ㄹ*/, 0x11B8/*ㅂ*/, 0x11BA/*ㅅ*/],
        [0x11A8/*ㄱ*/, 0x11BA/*ㅅ*/],
        [0x11BD/*ㅈ*/, 0x11C2/*ㅎ*/],
        [0x11A8/*ㄱ*/, 0x11B7/*ㅁ*/, 0x11B8/*ㅂ*/, 0x11BA/*ㅅ*/, 0x11C0/*ㅌ*/, 0x11C1/*ㅍ*/, 0x11C2/*ㅎ*/],
        [0x11BA/*ㅅ*/],
        [0x11BA/*ㅅ*/]
      ]
    ][a];
  }

  for (offset = base[0].length; exist != base[0][offset - 1]; offset--) {
    if (offset < 1) {
      // 겹소리가 될 수 있는 앞낱자가 아니라서 0 을 돌려준다
      return offset;
    }
  }

  base = base[offset];
  for (offset = base.length; 1; offset--) {
    if ( (offset < 1) || (charCode == base[offset - 1]) ) {
      return offset;
    }
  }
}

function ohi_html_Insert(commit, charCode) {
  var focus = inputText_focus();
  var charValue = String.fromCharCode(charCode);

  if (document.selection && browser == "MSIE" && browser_ver < 10) { // IE ~9
    var selection = document.selection.createRange ();
    var text = selection.text;
    if (text && document.selection.clear) { document.selection.clear (); }
    selection.text = (commit == OHIQ_INIT || (charCode && text.length > 1 ? '' : text)) + charValue;
    if (!charCode || !commit || selection.moveStart ('character', -1)) { selection.select (); }
  } else if (focus.selectionEnd + 1) {
    if (commit != OHIQ_INIT && (focus.selectionEnd - focus.selectionStart == 1)) { focus.selectionStart++; }
    var event = document.createEvent ('KeyboardEvent');
    if (event.initKeyEvent && !(browser == "Firefox" && browser_ver >= 12 ) && browser != "Chrome") { // Gecko
      event.initKeyEvent ('keypress', 0, 0, null, 0, 0, 0, 0, 127, charCode);
      if (charCode && focus.dispatchEvent (event) && commit) { focus.selectionStart--; }
    } else {// Firefox 12~, Chrome
      var scrollTop = focus.scrollTop;
      var scrollLeft = focus.scrollLeft;
      var selectionStart = focus.selectionStart;
      var endText = focus.value.substr (focus.selectionEnd, focus.value.length);// 커서 뒷쪽의 글자들
      focus.value = focus.value.substr (0, selectionStart);// 커서 앞쪽의 글자들
      if (charCode > 0) {
        focus.value += charValue;
      }
      var scrollHeight = focus.scrollHeight;
      var scrollWidth = focus.scrollWidth;
      focus.value += endText;

      // 팥알의 OHI: 2015.09.15 commit:05a84745c42c43254ea89de3ea81ca14e8da86dd
      // IE 11에서 textarea에 들어간 글의 맨 끝에서 줄을 바꾸면
      // 한글이 조합이 되지 않는 현상을 글의 맨 끝에 빈 칸을 집어 넣어서 막음
      if(charCode==0x0D && browser=='MSIE' && browser_ver==11 && !endText.length) {
        // IE 11에서 뒤에 아무 문자 없을 때 줄을 바꾸면 한글 조합이 안 됨
        focus.value += String.fromCharCode(0x20);
      }
      focus.scrollTop = (scrollTop > scrollHeight - focus.clientHeight) ? scrollTop : scrollHeight - focus.clientHeight;
      focus.scrollLeft = (scrollLeft > scrollWidth - focus.clientWidth) ? scrollLeft : scrollWidth - focus.clientWidth;
      focus.setSelectionRange (commit ? selectionStart : selectionStart + 1, selectionStart + 1);
    }
  }
  return;
}

function ohi_Insert(commit, charCode) {
  if (!charCode && ohiQ == OHIQ_INIT) {
    return true;
  }

  if (charCode.length != 6) {
    ohiQ = OHIQ_INIT;
  } else {
    commit = commit || OHIQ_INIT;
    // 두벌식에서 1, 3, 5 의 값은 offset 이기 때문에
    // 이 것을 앞의 값에 더해준다
    var cheot = charCode[0] + charCode[1];
    var gawit = charCode[2] + charCode[3];
    var ggeut = charCode[4] + charCode[5];

    if ( (charCode[0] > 0x3130 && charCode[0] < 0x318F) ||
        (charCode[2] > 0x3130 && charCode[2] < 0x318F) ||
        (charCode[4] > 0x3130 && charCode[4] < 0x318F) ) {
      // 호환자모를 쓰는 두벌식
      if (cheot && gawit) {
        //http://gernot-katzers-spice-pages.com/var/korean_hangul_unicode.html
        //tail = mod (Hangul codepoint − 0xac00, 28)
        //vowel = 1 + mod (Hangul codepoint − 0xac00 − tail, 588) / 28
        //lead = 1 + int [ (Hangul codepoint − 0xac00)/588 ]
        //Code point of Hangul = tail + (vowel−1)*28 + (lead−1)*588 + 44032
        // 유니코드 기반의 완성형 한글 조합 방식은 아래와 같다.
        // "낼"  =  44032  +  ( (2 * 588)  +  (1 * 28)  +  (8) )
        var offset_cheot;
        var offset_ggeut;

        if (cheot < 0x3133) { offset_cheot = 1; }
        else if (cheot < 0x3135) { offset_cheot = 2; }
        else if(cheot < 0x313a) { offset_cheot = 4; }
        else if (cheot < 0x3144) { offset_cheot = 11; }
        else { offset_cheot = 12; }

        if (ggeut < 0x3138) { offset_ggeut = 0; }
        else if (ggeut < 0x3143) { offset_ggeut = 1; }
        else if (ggeut < 0x3149) { offset_ggeut = 2; }
        else { offset_ggeut = 3; }

        // 각 호환자모를 호환자모의 순서번호로 바꾸어준다
        if (cheot) { cheot = cheot - 0x3130; }
        if (gawit) { gawit = gawit - 0x3130; }
        if (ggeut) { ggeut = ggeut - 0x3130; }

        // 완성 한글
        charCode = 0xac00 +
                    ((cheot - offset_cheot) * 588) +
                    ((gawit - 31) * 28) +
                    (ggeut - offset_ggeut);
        //charCode = (ggeut - 1) + (gawit -1)*28 + (cheot - 1)*588 + 0xac00;
      } else if ((cheot && !gawit && !ggeut) ||
                (!cheot && gawit && !ggeut) ||
                (!cheot && !gawit && ggeut)) {
        // 한글 호환자모
        charCode = cheot || gawit || ggeut;
      } else {
        charCode = charCode;
      }
    } else {
      // 표준자모 코드를 쓰는 세벌식
      // 1, 3, 5 에 값이 있으면 앞의 것은 겹소리이니
      // 앞에서 offset 으로 더해준 것을 없앤다
      if (charCode[1] >= 0x1100) {cheot = charCode[0];}
      if (charCode[3] >= 0x1100) {gawit = charCode[2];}
      if (charCode[5] >= 0x1100) {ggeut = charCode[4];}

      var count = 0;
      var last = 0;

      for(var index in ohiQ) {
        // 값이 있을 때마다 last 에 넣어주고
        // index 가 0,2,4 일 때만 count 를 올려준다
        // 첫만 있으면 count = 1
        // 첫가가 있으면 count = 2
        // 첫가끝이 있으면 count = 3
        if (ohiQ[index]) {
          if (!(index & 0x01)) {
            count++;
          }
          last = index;
        }
      }
      // 옛한글의 낱자가 조합이 되어 더해졌다
      // 조합된 낱자가 빠질 때는 ohi_Backspace() 에서 다룬다
      // 1,3,5 에 낱자가 있으면 0 으로 한다
      if ((fore_back < 0) && (last & 0x01)) {
        fore_back = 0;
      }

      if (cheot && gawit) {
        if ( (is_cheot_gawit_ggeut(cheot) == 0x09) ||
            (is_cheot_gawit_ggeut(gawit) == 0x0A) ||
            (is_cheot_gawit_ggeut(ggeut) == 0x0B) ) {
          // 옛한글을 다룬다
          // 옛한글을 넣을 때 preedit 의 옛한글 낱자들을 지워준다
          // 첫소리만 있으면 count=1, ohiQ[1] 에 있으면 fore_back=0,
          // 첫소리의 조합 전에 html 에는 ohiQ[1] 의 낱자가 보여지고 있었으니
          // 지워주고 ohiQ[0] 에 있는 조합된 낱자를 넣어준다
          for (count += fore_back; count > 0; count--) {
            ohi_html_Backspace();
          }

          if (commit) {
            ohi_html_Insert(commit, 0);
          }
          ohi_html_Insert(0, cheot);
          ohi_html_Insert(0, gawit);
          if (ggeut) {
            ohi_html_Insert(0, ggeut);
          }
        } else {
          //http://gernot-katzers-spice-pages.com/var/korean_hangul_unicode.html
          //tail = mod (Hangul codepoint − 0xac00, 28)
          //vowel = 1 + mod (Hangul codepoint − 0xac00 − tail, 588) / 28
          //lead = 1 + int [ (Hangul codepoint − 0xac00)/588 ]
          //Code point of Hangul = tail + (vowel−1)*28 + (lead−1)*588 + 44032
          // 유니코드 기반의 완성형 한글 조합 방식은 아래와 같다.
          // "낼"  =  44032  +  ( (2 * 588)  +  (1 * 28)  +  (8) )
          // 각 호환자모를 순서번호로 바꾸어준다

          // ohi_Backspace 에서 낱자를 지워서 ohiQ 에 옛한글이 없을 때
          // 옛한글 낱자가 있는 preedit 의 옛한글 낱자들을 지워준다
          if (fore_back > 0) {
            for (count += fore_back; count > 0; count--) {
              ohi_html_Backspace();
            }
          }

          if (cheot) {cheot = cheot - 0x1100;}
          if (gawit) {gawit = gawit - 0x1161;}
          if (ggeut) {ggeut = ggeut - 0x11A7;}
          charCode = 0xac00 + (cheot * 588) + (gawit * 28) + ggeut;
        }
      } else if ((cheot && !gawit && !ggeut) ||
                (!cheot && gawit && !ggeut) ||
                (!cheot && !gawit && ggeut)) {
        // 한글 호환자모
        // 각 표준자모를 호환자모로 바꿀 수 있는 것은 바꾸어준다
        if (cheot) { cheot = jamo_to_compatibility(cheot); }
        if (gawit) { gawit = jamo_to_compatibility(gawit); }
        if (ggeut) { ggeut = jamo_to_compatibility(ggeut); }

        charCode = cheot || gawit || ggeut;

        // ohi_Backspace 에서 낱자를 지워서 ohiQ 에 옛한글이 없을 때
        // 옛한글 낱자가 있는 preedit 의 옛한글 낱자들을 지워준다
        if (fore_back > 0) {
          for (count += fore_back; count > 0; count--) {
            ohi_html_Backspace();
          }
        }
      } else {
        charCode = charCode;
      }

      // 처리를 다 하고 기본값으로 돌아간다
      fore_back = -1;
    }
  }
  ohi_html_Insert(commit, charCode);
}

// 한글 낱자가 첫소리, 가윗소리, 끝소리 인지를 알려준다
function is_cheot_gawit_ggeut(charCode) {
  if(charCode>=0x1100 && charCode<=0x1112) {// 첫소리 Unicode block
    return 0x01;// 0001
  } else if(charCode>=0x1113 && charCode<=0x115F) {// 옛첫소리 Unicode block
    return 0x09;// 1001
  } else if(charCode>=0xA960 && charCode<=0xA97C) {// 옛첫소리 Extended-A
    return 0x09;// 1001
  } else if (charCode>0x1160 && charCode<=0x1175) {// 가윗소리 Unicode block
    return 0x02;// 0010
  } else if (charCode>=0x1176 && charCode<=0x11A7) {// 옛가윗소리 Unicode block
    return 0x0A;// 1010
  } else if (charCode>=0xD7B0 && charCode<=0xD7C6) {// 옛가윗소리 Extended-B
    return 0x0A;// 1010
  } else if (charCode>=0x11A8 && charCode<=0x11C2) {// 끝소리 Unicode block
    return 0x03;// 0011
  } else if (charCode>=0x11C3 && charCode<=0x11FF) {// 옛끝소리 Unicode block
    return 0x0B;// 1011
  } else if (charCode>=0xD7CB && charCode<=0xD7FB) {// 옛끝소리 Extended-B
    return 0x0B;// 1011
  } else {
    return 0;
  }
}

// 조합 규칙에서 찾아본다
function get_combination_value(ohiqCode, charCode, swap) {
  var key = 0;
  swap = typeof(swap != 'undefined') ? swap : false;
  if (swap) {
    // 입력순서를 따지지 않는 글판에서는
    // 작은 값을 앞에 놓아서 조합규칙의 크기를 줄인다.
    if (ohiqCode > charCode) {
      key = (charCode * 0x10000) + ohiqCode;
    } else {
      key = (ohiqCode * 0x10000) + charCode;
    }
  } else {
    key = (ohiqCode * 0x10000) + charCode;
  }

  var value = 0;
  var index = -1;
  var i;

  // [[기본규칙], [글판규칙]]
  for (i = hangeul_combination.length; i > 0; i--) {
    index = binarySearch(hangeul_combination[i - 1], key);
    if (index > -1) {
      value = hangeul_combination[i - 1][index][1];
      break;
    }
  }
  return value;
}

// 두벌식을 다룬다
function ohi_Hangeul_2(charCode){
  // 두벌식은 호환 자모를 쓴다
  charCode = jamo_to_compatibility(charCode);

  if(!/2-ksx/.test(KO_type)) {
    // 두벌식 순아래, 조선 국규
    if((ohiQ[2] == charCode) && !ohiQ[1]) {
      var offset = ohi_Double_Jamo(0, ohiQ[0], ohiQ[0]);
      if (offset) {
      // 홀소리 글쇠를 거듭 눌러 된소리 만들기
        ohiQ[1] = offset;
        ohi_Insert(0,ohiQ);
        return ohiQ[0] + offset;
      }
    } else if( (ohiQ[2] == 0x3151/*ㅑ*/ || ohiQ[2] == 0x3155/*ㅕ*/) &&
              (charCode == 0x3163/*ㅣ*/)) {
      // ㅕ+ㅣ→ㅖ, ㅑ+ㅣ→ㅒ
      ohiQ[3] = 1;
      ohi_Insert(0,ohiQ);
      return ohiQ[2] + ohiQ[3];
    }
  }

  if (0x3130 < charCode && charCode < 0x314F) { // Jaum
    if ( (!ohiQ[5] || !(ohiQ[0]=-1)) && ohiQ[2]) {
      ohiQ[5] = ohi_Double_Jamo (2, ohiQ[4], charCode);
    }
    if (!ohiQ[2] || ohiQ[0]<0 ||
          (ohiQ[0] &&
            (!ohiQ[4] || !ohiQ[5]) &&
            (ohiQ[4] ||
              charCode==0x3138/*ㄸ*/ ||
              charCode==0x3143/*ㅃ*/ ||
              charCode==0x3149/*ㅉ*/)
          )
        ) {
      if (ohiQ[1] || ohiQ[2] || !ohi_Double_Jamo (0, ohiQ[0], charCode)) {
        /*ohiQ = ohiQ;*/
      } else {
        ohiQ = 0;
      }
      ohi_Insert (ohiQ, ohiQ = [charCode,ohiQ?0:1,0,0,0,0] );
    } else if ( (!ohiQ[0] && (ohiQ[0]=charCode)) ||
                (ohiQ[4] = ohiQ[4] || charCode)
              ) {
      ohi_Insert (0, ohiQ);
    }
    if (ohiQ[5]) { ohiQ[5] = charCode; }
  } else if (0x314F <= charCode && charCode < 0x318F) { // Moum
    if(!ohiQ[3] || ohiQ[4] || !(ohiQ[2] = -1)) {
      if (!ohiQ[4]) {
        ohiQ[3] = ohi_Double_Jamo (1, ohiQ[2], charCode);
      }
    }
    if ((ohiQ[0] && ohiQ[2] > 0 && ohiQ[4]) && (ohiQ[5] || !(ohiQ[5] = ohiQ[4]) || !(ohiQ[4] = 0))) {
      ohi_Insert (0, Array(ohiQ[0],ohiQ[1],ohiQ[2],ohiQ[3],ohiQ[4],0));
      ohi_Insert (ohiQ, ohiQ=Array(ohiQ[5],0,charCode,0,0,0));
    } else if (((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4])) || ohiQ[2] < 0) {
      ohi_Insert (ohiQ, ohiQ=Array(0,0,charCode,0,0,0));
    } else if (ohiQ[2] = ohiQ[2] || charCode) {
      ohi_Insert (0, ohiQ);
    }
  } else { // Symbol
      ohi_Insert (0, ohiQ);
      ohi_Insert (0, charCode);
  }

  return charCode;
};

function ohi_Hangeul_3 (keyValue, charCode) {
  var galmadeuliCode = 0;
  var galmadeuli_cheot_gawit_ggeut = 0;
  var cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;

  if (/3moa-semoe/.test(KO_type)) {
    if (keyValue) { // 줄여넣기로 호출할 때 (keyValue == 0) 는 건너뛴다.
      // ohi_Hangeul_3Moa 에 있는 코드와 같다. 나중에 하나로 모으자
      if (extension_sign_keys.length) {
        var extension_start = 0;
        // 확장 배열로 들어가는 조건이다.
        if (!extension_steps) {
          if (extension_pressed_key) {
            if (keyValue == extension_sign_keys[1]) {
              extension_start = 1;
            } else if (keyValue == extension_sign_keys[2]) {
              extension_start = 2;
            } else if (keyValue == extension_sign_keys[3]) {
              extension_start = 3;
            }
          } else {
            if (keyValue == extension_sign_keys[0]) {
              extension_pressed_key = keyValue
              return 0;
            }
          }
        }

        if (extension_start > 0 && extension_start < 4) {
          // 확장 기호를 넣을 조건을 갖추었을 될 때
          // 1 단은 ㄱ, 2 단은 ㄴ, 3 단은 ㄷ 으로 나타낸다
          extension_steps = extension_start;
          mapping_layout_to_html(1);
          return charCode;
        } else if (extension_steps) {// 확장 기호를 넣을 때
          if (extension_sign_layout.length > 0) {
            var index =  keyValue.charCodeAt(0) - 0x21;
            var signCode = 0;
            if (index >= 0) {
              signCode = extension_sign_layout[index][extension_steps - 1];
            }
          }
          ohi_Backspace ();
          ohi_Insert (0, signCode);
          extension_steps = 0;
          extension_pressed_key = 0;
          // html 의 글쇠들을 기본 배열의 값으로 바꾸어 준다
          mapping_layout_to_html(0);
          return signCode;
        } else {
          extension_pressed_key = 0;
        }
      }
    }
  } else {
    if (extension_sign_keys.length) {
      var extension_start = 0;
      var sign_index = extension_sign_keys.indexOf(keyValue);
      var yetgeul_index = extension_yetgeul_keys.indexOf(keyValue);

      // 확장 배열로 들어가는 조건이다.
      if (sign_index > -1) {// 기호 확장 글쇠다
        if ( (extension_steps > 0) || (!ohiQ[0] && !ohiQ[2]) || ohiQ[2] ) {
          if (extension_sign_keys[0] == 0) {// 서로 같은 배열
            if (keyValue == extension_sign_keys[1]) {// 'v'
              if (extension_steps < 3) {
                extension_start = 1;
              }
            } else if (keyValue == extension_sign_keys[2]) {// '8'
              if (extension_steps < 3) {
                extension_start = 2;
              }
            }
          } else {// extension_sign_keys[0] == 1 // 각각 다른 배열
            if (keyValue == extension_sign_keys[1]) {// '/'
              // 앞에서 누른 것과 같은 글쇠일 때만
              if (!extension_pressed_key || (keyValue == extension_pressed_key)) {
                // 값이 0 일 때인 처음 한 번만 기본 값을 10 으로 바꾼다
                if (extension_steps % 10 == 0) {
                  extension_steps = 10;
                }
                if (extension_steps % 10 < 3) {
                  extension_start = 3;
                }
              }
            } else if (keyValue == extension_sign_keys[2]) {// '9'
              if (!extension_pressed_key || (keyValue == extension_pressed_key) ) {
                // 값이 0 일 때인 처음 한 번만 기본 값을 20 으로 바꾼다
                if (extension_steps % 20 == 0) {
                  extension_steps = 20;
                }
                if (extension_steps % 20 < 5) {
                  extension_start = 4;
                }
              }
            } else {
              ;
            }
          }
        }
      } else if (yetgeul_index > -1) {// 옛글 확장 글쇠다
          if (extension_yetgeul_keys.length) {
            if (keyValue == extension_yetgeul_keys[1]) {// '7'
              // 앞에서 누른 것과 같은 글쇠일 때만
              if (!extension_pressed_key || (keyValue == extension_pressed_key)) {
                // 값이 0 일 때인 처음 한 번만 기본 값을 10 으로 바꾼다
                if (extension_steps % 10 == 0) {
                  extension_steps = 10;
                }
                if (extension_steps % 10 < 3) {
                  extension_start = 5;
                }
              }
            } else if (keyValue == extension_yetgeul_keys[2]) {// '8'
              if (!extension_pressed_key || (keyValue == extension_pressed_key) ) {
                // 값이 0 일 때인 처음 한 번만 기본 값을 20 으로 바꾼다
                if (extension_steps % 20 == 0) {
                  extension_steps = 20;
                }
                if (extension_steps % 20 < 5) {
                  extension_start = 6;
                }
              }
            } else {
              ;
            }
          }
      }

      if (sign_index > -1) {// 기호 확장 글쇠다
        if ( (extension_start == 1) || (extension_start == 2) ) {
          do {
            // 서로 같은 배열
            // 확장으로 처음 들어오면 먼저 있던 것을 뿌린다
            if (extension_steps < 1) {
              ohi_Insert(ohiQ, ohiQ = OHIQ_INIT);
            }

            // 처음 눌리거나 앞서와 같으면 +1 씩
            if (extension_pressed_key && (extension_pressed_key != keyValue)) {
              if (extension_steps > 1) {
                // 아래의 return 을 건너뛰기 위해서 do {} while(); 을 쓴다
                // 기호글쇠에 있는 기호늘 넣기 위해서 빠져나간다
                break;
              } else {
                extension_steps += 2;
              }
            } else {
              extension_steps += 1;
            }
            extension_pressed_key = keyValue;

            if (extension_steps > 3) {
              extension_steps = 0;
              extension_pressed_key = 0;
              ohi_Insert(0, 0)
              mapping_layout_to_html(0);
            } else {
                         // html 에 기호 버열을 보여준다
              mapping_layout_to_html(1);
            }
            return charCode;
          } while (false);
        } else if ( (extension_start == 3) || (extension_start == 4) ) {
          // 각각 다른 배열
          // 확장으로 들어오면 먼저 있던 것을 뿌린다
          if ((extension_steps % 10) == 0) {
            ohi_Insert(ohiQ, ohiQ = OHIQ_INIT);
          }

          extension_steps += 1;
          extension_pressed_key = keyValue;

          if ( ((extension_steps > 13) && (extension_start == 3)) ||
              ((extension_steps > 25) && (extension_start == 4)) ) {
            extension_steps = 0;
            extension_pressed_key = 0;
            mapping_layout_to_html(0);
          } else {
            // html 에 기호 버열을 보여준다
            mapping_layout_to_html(1);
          }

          return charCode;
        }
      } else if (yetgeul_index > -1) {// 옛글 확장 글쇠다
        if ( (extension_start == 5) || (extension_start == 6) ) {
          // 각각 다른 배열
          // 옛글 확장으로 들어오면 먼저 있던 것을 뿌리지 않는다

          extension_steps += 1;
          extension_pressed_key = keyValue;

          if ( ((extension_steps > 12) && (extension_start == 5)) ||
              ((extension_steps > 22) && (extension_start == 6)) ) {
            extension_steps = 0;
            extension_pressed_key = 0;
            mapping_layout_to_html(0);
          } else {
            // html 에 옛글 버열을 보여준다
            mapping_layout_to_html(2);
          }

          return charCode;
        }
      }

      if (extension_steps) {
        sign_index = extension_sign_keys.indexOf(extension_pressed_key);
        yetgeul_index = extension_yetgeul_keys.indexOf(extension_pressed_key);

        if (sign_index > -1) {// 기호 확장 글쇠다
          // 확장 기호 넣기
          if (extension_sign_layout.length > 0) {
            var index =  keyValue.charCodeAt(0) - 0x21;
            var signCode = 0;
            if (index >= 0) {
              if (Math.floor(extension_steps / 20) == 1) {// '9'
                // [[], [0, 0, 0, 0, 0]]
                signCode = extension_sign_layout[index][1][extension_steps - 21];
              } else if (Math.floor(extension_steps / 10) == 1) {// '/'
                // [[0, 0, 0], []]
                signCode = extension_sign_layout[index][0][extension_steps - 11];
              } else {
                // [0, 0, 0]
                signCode = extension_sign_layout[index][extension_steps - 1];
              }
              // 해당 위치에 값이 없으면 0 으로 만든다
              if (typeof(signCode) == 'undifined') {
                signCode = 0;
              }
            }
          }

          if (signCode) {
            ohi_Insert (0, signCode);
          }
          extension_steps = 0;
          extension_pressed_key = 0;
          // html 의 글쇠들을 기본 배열의 값으로 바꾸어 준다
          mapping_layout_to_html(0);
          return signCode;
        } else if (yetgeul_index > -1) {// 옛글 확장 글쇠다
          // 확장 옛글 넣기
          if (extension_yetgeul_layout.length) {
            var index =  keyValue.charCodeAt() - 0x21;
            var yetgeulCode = 0;
            if (index >= 0) {
              if (Math.floor(extension_steps / 20) == 1) {// '9'
                // [[], [0, 0, 0, 0, 0]]
                yetgeulCode = extension_yetgeul_layout[index][1][extension_steps - 21];
              } else if (Math.floor(extension_steps / 10) == 1) {// '/'
                // [[0, 0, 0], []]
                yetgeulCode = extension_yetgeul_layout[index][0][extension_steps - 11];
              } else {
                // [0, 0, 0]
                yetgeulCode = extension_yetgeul_layout[index][extension_steps - 1];
              }
              // 해당 위치에 값이 없으면 0 으로 만든다
              if (typeof(yetgeulCode) == 'undifined') {
                yetgeulCode = 0;
              }
            }
          }
          if (yetgeulCode) {
            charCode = yetgeulCode;
            cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;
          }
          extension_steps = 0;
          extension_pressed_key = 0;
          mapping_layout_to_html(0);
        } else {
          extension_steps = 0;
          extension_pressed_key = 0;
          mapping_layout_to_html(0);
          return yetgeulCode;
        }
      }// if (extension_steps) {
    }// if (extension_sign_keys.length) {

    if (galmadeuli_layout.length) {
      var index =  binarySearch(galmadeuli_layout, charCode);
      if (index >= 0) {
        galmadeuliCode = galmadeuli_layout[index][1];
      } else {
        galmadeuliCode = 0;
      }
      galmadeuli_cheot_gawit_ggeut = is_cheot_gawit_ggeut(galmadeuliCode) & 0x07;
    }

    if (cheot_gawit_ggeut == 0) {
      if (keyValue == '[') {
        if (left_bracket_araea && ohiQ[0]) {
          charCode = 0x119e;
          right_oua = true;
        }
      }
    } else if (cheot_gawit_ggeut == 1) {
    } else if (cheot_gawit_ggeut == 2) {
      // right_ou_keys 가 있으면 오른쪽 ㅗㅜ
      if (right_ou_keys.length &&
          (right_ou_keys.indexOf(keyValue) >= 0)
          ) {
        right_oua = true;
      } else if (galmadeuliCode) {
        if (galmadeuli_cheot_gawit_ggeut == 2) {
          if (ohiQ[2] == 0x1175/*ㅣ*/ || ohiQ[2] == charCode) {
            // ㅣ + ㅐ , ㅐ + ㅐ
            ohiQ[2] = galmadeuliCode;
            ohi_Insert(0, ohiQ);
            return galmadeuliCode;
          }
        } else if (!ohiQ[4]) {
          // 가윗소리이고 끝소리가 없다
          if (ohiQ[2]) {
            var combined_value = 0;
            if (right_oua) {
              combined_value = get_combination_value(ohiQ[2], charCode);
            }
            right_oua = false;

            if (combined_value) {
              ohiQ[3] = ohiQ[2];
              ohiQ[2] = combined_value;
              ohi_Insert(0, ohiQ);
              return charCode;
            } else {
              charCode = galmadeuliCode;
              cheot_gawit_ggeut = galmadeuli_cheot_gawit_ggeut;
            }
          } else {
            right_oua = false;
          }
        } else if (ohiQ[0] && ohiQ[2] && ohiQ[4] && !ohiQ[5]) {
          // 같은 글쇠 거듭 눌러 겹받침 넣기
          // 겹받침을 넣기위해서 갈마들이 가윗소리로 바뀐 것을 다시 갈마들이 끝소리로 바꾼다
          if (galmadeuliCode == ohiQ[4]) {
            index =  binarySearch(galmadeuli_layout, galmadeuliCode);
            if (index >= 0) {
              ohiQ[5] = ohiQ[4];
              ohiQ[4] = galmadeuli_layout[index][1];
              ohi_Insert(0, ohiQ);
              return galmadeuliCode;
            }
          } else {
            // 홑받침이 있고 갈마들이 홑받침이 들어올 때, 조합이 된다면.
            var combined_value = get_combination_value(ohiQ[4], galmadeuliCode);
            if (combined_value) {
              ohiQ[5] = ohiQ[4];
              ohiQ[4] = combined_value;
              ohi_Insert(0, ohiQ);
              return galmadeuliCode;
            }
          }
        } else {
          right_oua = false;
        }
      } else {
        right_oua = false;
      }
    } else if (cheot_gawit_ggeut == 3) {
      if (galmadeuliCode) {
        if (ohiQ[2] && !ohiQ[4] &&
            (keyValue == keyValue.toUpperCase())
            ) {
          // 받침이 없을 때 윗글쇠를 함께 눌러 겹받침 넣기
          charCode = galmadeuliCode;
        } else if (ohiQ[0] && ohiQ[2] && ohiQ[4] && !ohiQ[5]) {
          if (charCode == ohiQ[4]) {
            index =  binarySearch(galmadeuli_layout, charCode);
            if (index >= 0) {
              ohiQ[5] = ohiQ[4];
              ohiQ[4] = galmadeuli_layout[index][1];
              ohi_Insert(0, ohiQ);
              return charCode;
            }
          }
        }
      }
    }
  }

  var combined_value = 0;
  //if (charCode >= 0x1100 && charCode <= 0x1112) {// Cho
  if (cheot_gawit_ggeut == 1) {// Cho
    //if (ohiQ[1] || ohiQ[2] || !ohi_Double_Jamo (0, ohiQ[0], charCode)) { /** ohiQ = ohiQ;**/ }
    //else { ohiQ = 0; }
    if (ohiQ[1] || ohiQ[2]) {
      /** ohiQ = ohiQ;**/
      ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
    } else {
      if (ohiQ[0]) {
        combined_value = get_combination_value(ohiQ[0], charCode);
      }
      if (combined_value) {
        // 첫소리가 조합이 된다면
        // ohiQ[0] 에는 조합된 것을 넣고
        // backspace 에 대비하기 위해서 ohiQ[1] 에는 있던 첫소리를 넣어둔다
        ohi_Insert(0, ohiQ=[combined_value,ohiQ[0],0,0,0,0]);
      } else {
        /** ohiQ = ohiQ;**/
        ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
      }
    }
  //} else if (charCode >= 0x1161 && charCode <= 0x1175) { // Jung
  } else if (cheot_gawit_ggeut == 2) { // Jung
    if (!ohiQ[3]) {
      //ohiQ[3] = ohi_Double_Jamo (1, ohiQ[2], charCode);
      combined_value = get_combination_value(ohiQ[2], charCode);
      if (combined_value) {
        ohiQ[3] = ohiQ[2];
        ohiQ[2] = combined_value;
      }
    } else {
      ohiQ[2] = -1;
    }

    if ((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4]) || (ohiQ[2] < 0)) {
      ohi_Insert(ohiQ, ohiQ=[0,0,charCode,0,0,0]);
    } else if (ohiQ[2] = ohiQ[2] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  //} else if (charCode >= 0x11A8 && charCode <= 0x11C2) { // Jong
  } else if (cheot_gawit_ggeut == 3) { // Jong
    if (!ohiQ[5]) {
      //ohiQ[5] = ohi_Double_Jamo (2, ohiQ[4], charCode);
      combined_value = get_combination_value(ohiQ[4], charCode);
      if (combined_value) {
        ohiQ[5] = ohiQ[4];
        ohiQ[4] = combined_value;
      }
    } else {
      ohiQ[4] = -1;
    }

    if(!ohiQ[0] || !ohiQ[2] || (ohiQ[4] && !ohiQ[5]) || (ohiQ[4] < 0)) {
      ohi_Insert(ohiQ, ohiQ=[0,0,0,0,charCode,0]);
    } else if (ohiQ[4] = ohiQ[4] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  } else {
    ohi_Insert(0, charCode);
  }

  return charCode;
}

function ohi_Hangeul_3Moa_Begin (keyValue, charCode) {
  if (extension_sign_keys.length) {
    var extension_start = 0;
    // 확장 배열로 들어가는 조건이다.
    if (!extension_steps) {
      if (extension_pressed_key) {
        if (keyValue == extension_sign_keys[1]) {
          extension_start = 1;
        } else if (keyValue == extension_sign_keys[2]) {
          extension_start = 2;
        } else if (keyValue == extension_sign_keys[3]) {
          extension_start = 3;
        }
      } else {
        if (keyValue == extension_sign_keys[0]) {
          extension_pressed_key = keyValue
          return 0;
        }
      }
    }

    if (extension_start > 0 && extension_start < 4) {
      // 확장 기호를 넣을 조건을 갖추었을 될 때
      // 1 단은 ㄱ, 2 단은 ㄴ, 3 단은 ㄷ 으로 나타낸다
      extension_steps = extension_start;
      mapping_layout_to_html(1);
      return charCode;
    } else if (extension_steps) {// 확장 기호를 넣을 때
      if (extension_sign_layout.length > 0) {
        var index =  keyValue.charCodeAt(0) - 0x21;
        var signCode = 0;
        if (index >= 0) {
          signCode = extension_sign_layout[index][extension_steps - 1];
        }
      }

      ohi_Insert (0, signCode);
      extension_steps = 0;
      extension_pressed_key = 0;
      // html 의 글쇠들을 기본 배열의 값으로 바꾸어 준다
      mapping_layout_to_html(0);
      return signCode;
    } else {
      extension_pressed_key = 0;
    }
  }

  shortening_english_keys.push(keyValue);
  shortening_hangeul_keys.push(charCode);

  return charCode;
}

function ohi_Hangeul_3Moa_End (keyValue, charCode) {
  // right_ou_keys 가 있으면 오른쪽 ㅗㅜ
  if (right_ou_keys.length) {
    if (right_ou_keys.indexOf(keyValue) >= 0) {
      right_oua = true;
    }
  }

  var combined_value = 0;
  var cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;

  if (cheot_gawit_ggeut == 1) {// Cho
    if (ohiQ[0]) {
      combined_value = get_combination_value(ohiQ[0], charCode, true);
      if (combined_value) {
        ohi_Insert(0, ohiQ=[combined_value,ohiQ[0],ohiQ[2],ohiQ[3],ohiQ[4],ohiQ[5]]);
      } else {
        ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
      }
    } else if (ohiQ[2] || ohiQ[4]) {
      ohi_Insert(0, ohiQ=[charCode,ohiQ[1],ohiQ[2],ohiQ[3],ohiQ[4],ohiQ[5]]);
    } else {
      ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
    }
  } else if (cheot_gawit_ggeut == 2) { // Jung
    if (ohiQ[2]) {
      combined_value = get_combination_value(ohiQ[2], charCode, true);
      if (combined_value) {
        ohi_Insert(0, ohiQ=[ohiQ[0],ohiQ[1],combined_value,ohiQ[2],ohiQ[4],ohiQ[5]]);
      } else {
        ohi_Insert(ohiQ, ohiQ=[0,0,charCode,0,0,0]);
      }
    } else if (ohiQ[0] || ohiQ[4]) {
      ohi_Insert(0, ohiQ=[ohiQ[0],ohiQ[1],charCode,ohiQ[3],ohiQ[4],ohiQ[5]]);
    } else {
      ohi_Insert(ohiQ, ohiQ=[0,0,charCode,0,0,0]);
    }
  } else if (cheot_gawit_ggeut == 3) { // Jong
    if (ohiQ[4]) {
      combined_value = get_combination_value(ohiQ[4], charCode, true);
      if (combined_value) {
        ohi_Insert(0, ohiQ=[ohiQ[0],ohiQ[1],ohiQ[2],ohiQ[3],combined_value,ohiQ[4]]);
      } else {
        ohi_Insert(ohiQ, ohiQ=[0,0,0,0,charCode,0]);
      }
    } else if (ohiQ[0] || ohiQ[2]) {
      ohi_Insert(0, ohiQ=[ohiQ[0],ohiQ[1],ohiQ[2],ohiQ[3],charCode,ohiQ[5]]);
    } else {
      ohi_Insert(ohiQ, ohiQ=[0,0,0,0,charCode,0]);
    }
  } else {
    ohi_Insert(0, charCode);
  }

  return charCode;
}

function ohi_Hangeul_3Shin (keyValue, charCode) {
  var galmadeuliCode = 0;

  if (galmadeuli_layout.length > 0) {
    var index =  binarySearch(galmadeuli_layout, charCode);
    if (index >= 0) {
      galmadeuliCode = galmadeuli_layout[index][1];
    } else {
      galmadeuliCode = 0;
    }
  }

  if (extension_sign_keys.length && !yet_hangeul) {
    // 옛한글을 넣을 때는 확장배열을 쓰지 않는다
    var extension_start = 0;
    // 확장 배열로 들어가는 조건이다.
    if (!extension_steps) {
      if (ohiQ[0] == extension_sign_keys[0]) {
        if (!ohiQ[2] && !ohiQ[4]) {
          if (keyValue == extension_sign_keys[1]) {
            extension_start = 1;
          } else if (keyValue == extension_sign_keys[2]) {
            extension_start = 2;
          } else if (keyValue == extension_sign_keys[3]) {
            extension_start = 3;
          }
        }
      }
    }

    if (extension_start > 0 && extension_start < 4) {
      // 신세벌 확장 기호를 넣을 조건을 갖추었을 될 때
      // 1 단은 ㄱ, 2 단은 ㄴ, 3 단은 ㄷ 으로 나타낸다
      extension_steps = extension_start;
      mapping_layout_to_html(1);
      return charCode;
    } else if (extension_steps) {// 신세벌식 확장 기호를 넣을 때
      if (extension_sign_layout.length > 0) {
        var index =  keyValue.charCodeAt(0) - 0x21;
        var signCode = 0;
        if (index >= 0) {
          signCode = extension_sign_layout[index][extension_steps - 1];
        }
      }
      ohi_Backspace ();
      ohi_Insert (0, signCode);
      extension_steps = 0;
      // html 의 글쇠들을 기본 배열의 값으로 바꾸어 준다
      mapping_layout_to_html(0);
      return signCode;
    }
  }

  var input_cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;

  if (input_cheot_gawit_ggeut == 0) {
    if (keyValue == '[') {
      if (left_bracket_araea && ohiQ[0]) {
        // [ 글쇠로 아래아를 넣는 글판이다
        charCode = 0x119e;
        right_oua = true;
      }
    } else if (keyValue == '?') {
      if (yet_hangeul && ohiQ[0] && !ohiQ[2] && !ohiQ[4]) {
        // 옛한글을 넣을 때
        // [시프트 + 오른쪽 글쇠의 위의 홀소리]는 [글쇠의 아래 닿소리]가 된다
        // 소문자로 바꾸어 그 코드의 값에 있는 글판의 글쇠값을 가져온다
        var keyCode = "/".charCodeAt();
        charCode = hangeul_layout[keyCode - 0x21];
      }
    }
  } else if (input_cheot_gawit_ggeut == 1) {
    if (galmadeuliCode) {
      if (ohiQ[0] && !ohiQ[2]) {
        if (charCode == 0x110F/*ㅋ*/) {
          // 오른손 쪽 ㅋ 자리에 들어간 ㅗ
          charCode = galmadeuliCode;  // ㅗ 혹은 ㆍ(아래아)
          right_oua = true;
        } else if (right_ou_keys.indexOf(keyValue.toUpperCase()) >= 0) {
          // 첫소리가 들어갔을 때에 오른손 자리의 가운뎃소리(ㅗ, ㅜ, ㅢ) 넣기
          charCode = galmadeuliCode;
          if (charCode != 0x1174/*ㅢ*/) {// ㅢ 는 뺀다
            right_oua = true;
          }
        }
      }
    }
  } else if (input_cheot_gawit_ggeut == 2) {
    if (right_ou_keys.indexOf(keyValue) >= 0) {
      if (yet_hangeul) {
        // 옛한글을 넣을 때
        // [시프트 + 오른쪽 글쇠의 위의 홀소리]는 [글쇠의 아래 닿소리]가 된다
        // 소문자로 바꾸어 그 코드의 값에 있는 글판의 글쇠값을 가져온다
        var keyCode = keyValue.toLowerCase().charCodeAt();
        charCode = hangeul_layout[keyCode - 0x21];
      } else {
        // 시프트를 누르고 오른손 윗글 자리의 가운뎃소리(ㅡ, ㅗ, ㅜ) 넣기
        right_oua = true;
      }
    } else if (yet_hangeul && ohiQ[0] && !ohiQ[2] && !ohiQ[4]) {
      // yet_hangeul 이 true 면
      // 왼쪽의 홀소리로 겹홀소리를 만들 수 있다.
      right_oua = true;
    } else if (!ohiQ[0] && !ohiQ[2] && !ohiQ[4]) {
      // 아무것도 없을 때
      // 왼쪽의 홀소리로 겹홀소리를 만들 수 있다
      right_oua = true;
    } else if (galmadeuliCode) {
      if (!right_oua && ohiQ[0] && ohiQ[2] && !ohiQ[4]) {
        // 가윗소리이고,  끝소리만 없으며 갈마들이의 값이 있다
        // 윗글쇠를 함께 눌렀을 때 왼쪽 윗글 자리의 겹받침 넣기
        charCode = galmadeuliCode;
      } else if ( (/shin-p/.test(KO_type)) && ohiQ[4]) {
        // (right_ou_keys.indexOf(keyValue) < 0) && (keyValue != '/')
        // 위 조건도 들어가야 하지만 부모의 조건에서 걸러진다
        // 가윗소리가 들어 왔으니 끝소리로 바꾸어 끝소리 조합을 해본다
        var combined = get_combination_value(ohiQ[4], galmadeuliCode);
        if (combined) {
          charCode = galmadeuliCode;
        }
      }
    }
  } else if (input_cheot_gawit_ggeut == 3) {
    if (galmadeuliCode) {
      if (right_oua && ohiQ[2] && !ohiQ[3] && !ohiQ[4]) {
        // 겹홀소리에서 ㅗ, ㅜ 에 갈마들이 가윗소리를 넣는다
        right_oua = false;
        var combined_value = get_combination_value(ohiQ[2], galmadeuliCode);
        if (combined_value) {
          ohiQ[3] = ohiQ[2];
          ohiQ[2] = combined_value;
          ohi_Insert(0, ohiQ);
          return galmadeuliCode;
        }
      } else if (ohiQ[0] && !ohiQ[2] && !ohiQ[4]) {
        // 왼손 쪽 가운뎃소리 넣기
        charCode = galmadeuliCode;
        right_oua = false;
      } else if ( (/shin-2/.test(KO_type)) &&
                  ohiQ[0] && ohiQ[2] &&
                  (charCode == ohiQ[4])
                ) {
        // 같은 글쇠 거듭 눌러 겹받침 넣기
        // 겹받침을 넣기위해서 갈마들이 가윗소리로 바뀐 것을 다시 갈마들이 끝소리로 바꾼다
        var index =  binarySearch(galmadeuli_layout, galmadeuliCode);
        if (index >= 0) {
          ohiQ[4] = 0;
          ohiQ[5] = 0;
          galmadeuliCode = galmadeuli_layout[index][1];
          charCode = galmadeuliCode;
        }
      }
    }
  }

  var combined_value = 0;
  // cheot_gawit_ggeut, input_cheot_gawit_ggeut 둘 다 쓰인다
  var cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;

  if (cheot_gawit_ggeut == 1) {// Cho
    //if (ohiQ[1] || ohiQ[2] || !ohi_Double_Jamo (0, ohiQ[0], charCode)) { /** ohiQ = ohiQ;**/ }
    //else { ohiQ = 0; }
    if ((!yet_hangeul && ohiQ[1]) || ohiQ[2]) {
      /** ohiQ = ohiQ;**/
      ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
    } else {
      if (ohiQ[0]) {
        combined_value = get_combination_value(ohiQ[0], charCode);
      }
      if (combined_value) {
        // 첫소리가 조합이 된다면
        // ohiQ[0] 에는 조합된 것을 넣고
        // backspace 에 대비하기 위해서 ohiQ[1] 에는 있던 첫소리를 넣어둔다
        ohi_Insert(0, ohiQ=[combined_value,ohiQ[0],0,0,0,0]);
      } else {
        /** ohiQ = ohiQ;**/
        ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
      }
    }
  } else if (cheot_gawit_ggeut == 2) { // Jung
    if (!ohiQ[3] || yet_hangeul) {
      //ohiQ[3] = ohi_Double_Jamo (1, ohiQ[2], charCode);
      combined_value = get_combination_value(ohiQ[2], charCode);
      if (combined_value) {
        ohiQ[3] = ohiQ[2];
        ohiQ[2] = combined_value;
      }
    } else {
      ohiQ[2] = -1;
    }

    if ((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4]) || (ohiQ[2] < 0)) {
      ohi_Insert(ohiQ, ohiQ=[0,0,charCode,0,0,0]);
    } else if (ohiQ[2] = ohiQ[2] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  } else if (cheot_gawit_ggeut == 3) { // Jong
    if (!ohiQ[5] || yet_hangeul) {
      //ohiQ[5] = ohi_Double_Jamo (2, ohiQ[4], charCode);
      combined_value = get_combination_value(ohiQ[4], charCode);
      if (combined_value) {
        ohiQ[5] = ohiQ[4];
        ohiQ[4] = combined_value;
      }
    } else {
      ohiQ[4] = -1;
    }

    if(!ohiQ[0] || !ohiQ[2] || (ohiQ[4] && !ohiQ[5]) || (ohiQ[4] < 0)) {
      if (input_cheot_gawit_ggeut == 2) {
        // 끝소리 + (shift+글쇠의 가윗소리) 로 겹받침을 넣는 글판을 다룬다
        ohi_Insert(0, ohiQ);
      } else {
        ohi_Insert(ohiQ, ohiQ=[0,0,0,0,charCode,0]);
      }
    } else if (ohiQ[4] = ohiQ[4] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  } else {
    ohi_Insert(0, charCode);
  }

  return charCode;
}

function ohi_Hangeul_3Shin_Shift (keyValue, charCode) {
  var galmadeuliCode = 0;

  if (galmadeuli_layout.length > 0) {
    var index =  binarySearch(galmadeuli_layout, charCode);
    if (index >= 0) {
      galmadeuliCode = galmadeuli_layout[index][1];
    } else {
      galmadeuliCode = 0;
    }
  }

  var cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;
  if (cheot_gawit_ggeut == 0) {
    ;
  } else if (cheot_gawit_ggeut == 1) {
    if (ohiQ[0] && !ohiQ[2]) {
      if (galmadeuliCode) {
        if (right_ou_keys.indexOf(keyValue.toUpperCase()) >= 0) {
          // 첫소리가 들어갔을 때에 오른손 자리의 가운뎃소리(ㅗ, ㅜ) 넣기
          charCode = galmadeuliCode;
          right_oua = true;
        }
      } else if (charCode == 0x110F/*ㅋ*/) {
        // 오른손 쪽 ㅋ 자리에 들어간 ㅗ
        charCode = 0x1169/*ㅗ*/;
        right_oua = true;
      }
    }
  } else if (cheot_gawit_ggeut == 2) {
    if (right_ou_keys.indexOf(keyValue) >= 0) {
      // 첫소리가 들어가지 않았을 때에 오른손 윗글 자리의 가운뎃소리(ㅗ, ㅜ) 넣기
      right_oua = true;
    } else if (!ohiQ[0] && !ohiQ[2]) {
      // 왼쪽 ㅗ·ㅜ로도 ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ를 조합할 수 있다.
      // (왼쪽 ㅗ·ㅜ와 오른쪽 ㅗ·ㅜ의 동작이 같다)
      right_oua = true;
    } else if ( right_oua && !ohiQ[3] && !ohiQ[4]) {
      // 겹홀소리 ㅗ, ㅜ 일 때 가윗소리를 넣는다
      right_oua = false;
    } else if (galmadeuliCode) {
      if (!right_oua && ohiQ[0] && ohiQ[2] && !ohiQ[4]) {
        // 왼손 끝소리 넣기
        charCode = galmadeuliCode;
      } else if (ohiQ[0] && ohiQ[2] && ohiQ[4] && !ohiQ[5]) {
        // 겹받침 조합하기
        // 겹받침을 넣기위해서 갈마들이 끝소리로 바뀐 것을 다시 갈마들이 겹끝소리로 바꾼다
        var combined_value = get_combination_value(ohiQ[4], galmadeuliCode);
        if (combined_value) {
          ohiQ[5] = ohiQ[4];
          ohiQ[4] = combined_value;
          ohi_Insert(0, ohiQ);
          return galmadeuliCode;
          //charCode = combined_value;
        }
      } else if (ohiQ[0] && ohiQ[2] && !ohiQ[5] &&
              (galmadeuliCode == ohiQ[4])
            ) {
        // 같은 글쇠 거듭 눌러 겹받침 넣기
        // 겹받침을 넣기위해서 갈마들이 가윗소리로 바뀐 것을 다시 갈마들이 끝소리로 바꾼다
        var index =  binarySearch(galmadeuli_layout, galmadeuliCode);
        if (index >= 0) {
          galmadeuliCode = galmadeuli_layout[index][1];
          charCode = galmadeuliCode;
          ohiQ[4] = 0;
          ohiQ[5] = 0;
        }
      }
    }
  } else if (cheot_gawit_ggeut == 3) {
    if (galmadeuliCode) {
      if (ohiQ[0] && ohiQ[2] && !ohiQ[4]) {
        // 끝소리이고 첫소리, 가윗소리가 있고 끝소리가 없으며 갈마들이의 값이 있다
        // 윗글쇠를 함께 눌렀을 때 왼쪽 윗글 자리의 겹받침 넣기
        charCode = galmadeuliCode;
      }
    }
  }

  cheot_gawit_ggeut = is_cheot_gawit_ggeut(charCode) & 0x07;
  var combined_value = 0;
  if (cheot_gawit_ggeut == 1) {// Cho
    //if (ohiQ[1] || ohiQ[2] || !ohi_Double_Jamo (0, ohiQ[0], charCode)) { /** ohiQ = ohiQ;**/ }
    //else { ohiQ = 0; }
    if (ohiQ[1] || ohiQ[2]) {
      /** ohiQ = ohiQ;**/
      ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
    } else {
      if (ohiQ[0]) {
        combined_value = get_combination_value(ohiQ[0], charCode);
      }
      if (combined_value) {
        // 첫소리가 조합이 된다면
        // ohiQ[0] 에는 조합된 것을 넣고
        // backspace 에 대비하기 위해서 ohiQ[1] 에는 있던 첫소리를 넣어둔다
        ohi_Insert(0, ohiQ=[combined_value,ohiQ[0],0,0,0,0]);
      } else {
        /** ohiQ = ohiQ;**/
        ohi_Insert(ohiQ, ohiQ=[charCode,0,0,0,0,0]);
      }
    }
  } else if (cheot_gawit_ggeut == 2) { // Jung
    if (!ohiQ[3]) {
      //ohiQ[3] = ohi_Double_Jamo (1, ohiQ[2], charCode);
      combined_value = get_combination_value(ohiQ[2], charCode);
      if (combined_value) {
        ohiQ[3] = ohiQ[2];
        ohiQ[2] = combined_value;
      }
    } else {
      ohiQ[2] = -1;
    }

    if ((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4]) || (ohiQ[2] < 0)) {
      ohi_Insert(ohiQ, ohiQ=[0,0,charCode,0,0,0]);
    } else if (ohiQ[2] = ohiQ[2] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  } else if (cheot_gawit_ggeut == 3) { // Jong
    if (!ohiQ[5]) {
      //ohiQ[5] = ohi_Double_Jamo (2, ohiQ[4], charCode);
      combined_value = get_combination_value(ohiQ[4], charCode);
      if (combined_value) {
        ohiQ[5] = ohiQ[4];
        ohiQ[4] = combined_value;
      }
    } else {
      ohiQ[4] = -1;
    }

    if(!ohiQ[0] || !ohiQ[2] || (ohiQ[4] && !ohiQ[5]) || (ohiQ[4] < 0)) {
      ohi_Insert(ohiQ, ohiQ=[0,0,0,0,charCode,0]);
    } else if (ohiQ[4] = ohiQ[4] || charCode) {
      ohi_Insert(0, ohiQ);
    }
  } else {
    ohi_Insert(0, charCode);
  }

  return charCode;
}

function convert_english(keyCode, index) {
	return english_layout[keyCode - 0x21][index];
}

// Roman keyboard layouts (Dvorak, Colemak)
function ohi_Roman(keyCode) {
  ohi_Insert(0, keyCode);
}

// 한글을 다루는 시작점이다
function ohi_Hangeul_Process(keyCode) {
  if (keyCode == 0x00) {
    // 글쇠가 떼어질 때 0x00 을 넘겨받는다.
    if (shoot_at_once == false) {
      pressing_keys = 0;
      return false;
    } else if (pressing_keys > 1) {
      pressing_keys--;
      return false;
    } else if (pressing_keys < 1) {
      pressing_keys = 0;
      return false;
    } else {
      pressing_keys = 0;

      var string = [];
      if (shortening && Object.keys(shortening_layout).length) {
        // 줄여넣기를 다룬다
        var input_keys = shortening_english_keys;
        input_keys.sort();
        for (var i in shortening_layout.english) {
          if (input_keys.toString() == shortening_layout.english[i].keys.toString()) {
            string = shortening_layout.english[i].chars;
            shortening_action = shortening_layout.english[i].count;
          }
        }
        if (!string.length) {
          var input_keys = shortening_hangeul_keys;
          input_keys.sort();
          for (var i in shortening_layout.hangeul) {
            if (input_keys.toString() == shortening_layout.hangeul[i].keys.toString()) {
              string = shortening_layout.hangeul[i].chars;
              shortening_action = shortening_layout.hangeul[i].count;
            }
          }
        }
      }

      if (string.length) {
        for (var i in string) {
          ohi_Hangeul_3(0, string[i]);
        }
        ohi_Insert(ohiQ, 0);
      } else {
        ohi_Insert(ohiQ, 0);
        for (var index in shortening_hangeul_keys) {
          ohi_Hangeul_3Moa_End(shortening_english_keys[index], shortening_hangeul_keys[index]);
        }
      }

      shortening_english_keys = [];
      shortening_hangeul_keys = [];

      return false;
    }
  } else if (keyCode < 0x21 || keyCode > 0x7E) {
    if (extension_steps > 0) {
      if(keyCode != 0x0F) { // !shift
        if (keyCode != 0x08) {// !Backspace
          ohi_Backspace();
        }

        extension_steps = 0;
        mapping_layout_to_html(0);
        ohiQ = OHIQ_INIT;
      }
    } else if(keyCode == 0x08) {    // Backspace
      ohi_Backspace();
    } else if ( (keyCode == 0x09) ||  // Tab
                (keyCode == 0x20) //Space
              ) {
      ohi_Insert(0,keyCode);
    } else if (keyCode == 0x1B) {// Esc
      ohi_Insert(0,0);
    } else if(keyCode == 0x0D) { // Enter (한글 조합 상태)
      ohi_Insert(0,keyCode);
    } else {
      ohi_Insert(ohiQ,ohiQ=OHIQ_INIT);
    }

    pressing_keys = 0;
    shortening_action = 0;

    return false;
  }

  pressing_keys++;

  if(KE_status == 'en') {
    ohi_Roman(keyCode);
    return true;
  }
  keyCode = convert_english(keyCode, 1);
  var charCode = hangeul_layout[keyCode - 0x21];
  var keyValue = String.fromCharCode(keyCode);

  switch (true) {
    case /3-/.test(KO_type) :
      charCode = ohi_Hangeul_3(keyValue, charCode);
      break;
    case /3moa/.test(KO_type) :
      if (shoot_at_once) {
        charCode = ohi_Hangeul_3Moa_Begin(keyValue, charCode);
      } else {
        charCode = ohi_Hangeul_3(keyValue, charCode);
      }
      break;
    case /3shin/.test(KO_type) :
      if (/shift/.test(KO_type)) {
        charCode = ohi_Hangeul_3Shin_Shift(keyValue, charCode);
      } else {
        charCode = ohi_Hangeul_3Shin(keyValue, charCode);
      }
      break;
    default :
      charCode = ohi_Hangeul_2(charCode);
      break;
  }

  $('.keyboard .charcode').html("\t0x" + charCode.toString(16) +
                                " => " + String.fromCharCode(charCode));

  return true;
}

function inputText_focus() {
  if (focus_tag_id == "jamo_panel") {
    return;
  }
  var focus = document.getElementById(focus_tag_id);
  if (focus.tagName.toLowerCase() != 'textarea' &&
        focus.tagName.toLowerCase() != 'input'
      ) {
    focus = document.getElementById('inputText');
  }
  focus.focus()
  return focus;
}

// sign_yetgeul #1:sign #2:yetgeul
function set_extension_table(sign_yetgeul) {
  var layout = [];
  switch(sign_yetgeul) {
    case 1: layout = extension_sign_layout; break;
    case 2: layout = extension_yetgeul_layout; break;
    default : alert("확장 배열이 없습니다."); return;
  }

  if (html_map_layout.length < 1) {
    html_map_layout = get_table_html_mapping();
  }

  var charCode = 0;
  var extensionCode = 0;
  var key_name;
  var key_up_down;
  var html_table = {};
  var i;

  var steps = [0, 0];
  if (Math.floor(extension_steps / 20) == 1) {
    steps = [2, extension_steps - 21];
  } else if (Math.floor(extension_steps / 10) == 1) {
    steps = [1, extension_steps - 11];
  } else if (extension_steps > 0) {
    steps = [0, extension_steps - 1];
  } else {
    return;
  }

  for(i = 0; i < 94; i++) {
    if (steps[0] == 2) {
      extensionCode = layout[i][1][steps[1]];
    } else if (steps[0] == 1) {
      extensionCode = layout[i][0][steps[1]];
    } else if (steps[0] == 0) {
      extensionCode = layout[i][steps[1]];
    } else {
      return;
    }

    if (typeof(extensionCode) == 'undefined') {
      extensionCode = 0;
    }

    if (extensionCode > 0x20) {
      extensionCode = String.fromCharCode(extensionCode);
    } else {
      extensionCode = 0;
    }

    charCode = String.fromCharCode(english_layout[i][0]);

    key_name = html_map_layout[i][0]
    key_up_down = html_map_layout[i][1]
    if(typeof(html_table[key_name]) == "undefined") {
      html_table[key_name] = {};
    }
    if(typeof(html_table[key_name][key_up_down]) == "undefined") {
      html_table[key_name][key_up_down] = [];
    }

    html_table[key_name][key_up_down] = [charCode, extensionCode];
  }
  // object
  return html_table;
}

function set_basic_table() {
  if (!english_layout.length) {
    english_layout = get_table_english(EN_type);
  }
  if (!hangeul_layout.length) {
    hangeul_layout = get_table_hangeul(KO_type);
  }
  if (!galmadeuli_layout.length) {
    galmadeuli_layout = get_table_galmadeuli(KO_type);
  }
  if (!html_map_layout.length) {
    html_map_layout = get_table_html_mapping();
  }


  var charCode = 0;
  // 배열표에 보여주기 위한 호환 코드
  var compCode = 0;
  var compString = 0;
  var galmaCode = 0;
  var galmaString = 0;
  var cheot_gawit_ggeut = 0;
  var key_name;
  var key_up_down;
  var html_table = {};
  var i;
  for(i = 0; i < 94; i++) {
    cheot_gawit_ggeut = is_cheot_gawit_ggeut(hangeul_layout[i]) & 0x07
    compCode = jamo_to_compatibility(hangeul_layout[i])
    if(compCode > 0) {
      //compCode = compCode;
    } else {
      compCode = hangeul_layout[i];
    }

    compString = String.fromCharCode(compCode);

    if (galmadeuli_layout.length > 0) {
      var galma_no = 0;
      for (galma_no = 0; galma_no < galmadeuli_no_display_keys.length; galma_no++) {
        if (galmadeuli_no_display_keys[galma_no] == html_map_layout[i][0]) {
          break;
        }
      }
      // 갈마들이를 보여주지 말아야하는 글쇠면 0 을 넣는다
      if (galma_no < galmadeuli_no_display_keys.length) {
        galmaCode = 0;
        galmaString = 0;
      } else {
        var index =  binarySearch(galmadeuli_layout, hangeul_layout[i]);
        if (index >= 0) {
          galmaCode = jamo_to_compatibility(galmadeuli_layout[index][1]);
          galmaString = String.fromCharCode(galmaCode);
        } else {
          galmaCode = 0;
          galmaString = 0;
        }
      }
    }

    charCode = String.fromCharCode(english_layout[i][0]);

    key_name = html_map_layout[i][0]
    key_up_down = html_map_layout[i][1]
    if(typeof(html_table[key_name]) == "undefined") {
      html_table[key_name] = {};
    }
    if(typeof(html_table[key_name][key_up_down]) == "undefined") {
      html_table[key_name][key_up_down] = [];
    }

    html_table[key_name][key_up_down] = [
      charCode,
      compString, compCode, cheot_gawit_ggeut,
      galmaString, galmaCode
    ];
  }
  // object
  return html_table;
}

// select #0:기본배열, #1:기호버열, #2:옛한글배열
function mapping_layout_to_html(select) {
  var html_table = {};

  switch (select) {
    case 1 : html_table = set_extension_table(1); break;
    case 2 : html_table = set_extension_table(2); break;
    case 0 :
    default : html_table = set_basic_table(); break;
  }

  var id, name, node;
  var i;
  var up_en_key;
  var up_han_key;
  var down_en_key;
  var down_han_key;
  var keys = $('div.keyboard div.key');

  $(".shift_pressed").removeClass("shift_pressed");
  $(".capslock_pressed").removeClass("capslock_pressed");
  $(".ggeut").removeClass("ggeut");
  $(".gawit").removeClass("gawit");
  $(".gawit_right").removeClass("gawit_right");
  $(".cheot").removeClass("cheot");
  $(".galma").removeClass("galma");
  $(".font08").removeClass("font08");
  $(".tag07").removeClass("tag07");
  $(".tag08").removeClass("tag08");
  $(".tag09").removeClass("tag09");
  $(".black").removeClass("black");
  $(".ko_alpha").removeClass("ko_alpha");
  $(".extension_key").removeClass("extension_key");

  $.each(keys, function(_, node) {
    node = $(node);
    id = node.attr("id");
    if(typeof(html_table[id]) != "undefined") {
      up_en_key = node.children("em.up_key").children("div.en_key");
      up_han_key = node.children("em.up_key").children("div.han_key");
      down_en_key = node.children("strong.down_key").children("div.en_key");
      down_han_key = node.children("strong.down_key").children("div.han_key");
      up_en_key.html("");
      up_han_key.html("");
      down_en_key.html("");
      down_han_key.html("");

      if (extension_steps) {
        up_en_key.html(html_table[id]["false"][0].toUpperCase());
        up_en_key.addClass("ko_alpha");

        if (html_table[id]["true"][1]) {
          up_han_key.html(html_table[id]["true"][1]);
          up_han_key.addClass("extension_key");
        }
        if (html_table[id]["false"][1]) {
          down_han_key.html(html_table[id]["false"][1]);
          down_han_key.addClass("extension_key");
        }
      } else {
        // 영문 윗글쇠
        up_en_key.html(html_table[id]["true"][0]);
        if (html_table[id]["true"][0].search(/[A-Z]/i) == 0) {
          // 한글 상태일 때 흐릿하게 만든다
          if(KE_status == 'ko') {
            up_en_key.addClass("ko_alpha");
          }
        }
        // 영문 아랫글쇠
        if (html_table[id]["true"][0].toLowerCase() != html_table[id]["false"][0]) {
          // 영문의 아랫글에는 윗글쇠값의 소문자와 다르면 넣는다
          down_en_key.html(html_table[id]["false"][0]);
        }

        if ((KE_status == 'ko') && hangeul_layout.length) {
          // 한글 아랫글쇠
          if(html_table[id]["false"][0] != html_table[id]["false"][1]) {
            //한글의 아랫글쇠에는 아랫글쇠값이 서로 다르면 넣는다
            down_han_key.html(html_table[id]["false"][1]);
            down_en_key.addClass("ko_alpha");
            if(html_table[id]["false"][3] == 3) {
              node.addClass("ggeut");
            } else if(html_table[id]["false"][3] == 2) {
              node.addClass("gawit");
            } else if(html_table[id]["false"][3] == 1) {
              node.addClass("cheot");
            } else {
                ;
            }
          } else {
            down_han_key.html("");
          }
          // 한글 윗글쇠
          if(html_table[id]["true"][0] != html_table[id]["true"][1]) {
            // 한글의 윗글쇠에는 윗글쇠값이 서로 다르면 넣는다
            if(html_table[id]["true"][1] != html_table[id]["false"][1]) {
              //한글의 윗글쇠에는 아래윗글쇠값이 서로 다르면 넣는다
              up_han_key.html(html_table[id]["true"][1]);
              up_en_key.addClass("ko_alpha");
              if ((/3-p/.test(KO_type)) &&
                  (html_table[id]["true"][2] >= 0x3131) &&
                  (html_table[id]["true"][2] <= 0x314E) &&
                  (compatibility_hot.indexOf(html_table[id]["true"][2]) < 0)
                ) {
                // 겹받침
                up_han_key.addClass("ko_gyeob_bat_chim");
              }
            } else {
              up_han_key.html("");
            }
          } else {
            up_han_key.html("");
          }

          // 갈마들이
          // 아랫글에 대한 갈마들이가 있고 갈마들이가 한글 윗글쇠와 다르다
          if (html_table[id]["false"][4] &&
              (html_table[id]["false"][4] != html_table[id]["true"][1])
              ) {
            // 영문 아랫글쇠에 값이 있으면 한글 윗글쇠를 보고 비었으면 한글 윗글쇠에 넣는다
            if (down_en_key.html()) {
              // 모아치기 글판
              if (!up_han_key.html()) {
                up_han_key.html(html_table[id]["false"][4]);
                if ((/3-p/.test(KO_type)) &&
                    (html_table[id]["true"][2] >= 0x3131) &&
                    (html_table[id]["true"][5] <= 0x314E) &&
                    (compatibility_hot.indexOf(html_table[id]["true"][5]) < 0)
                  ) {
                  // 겹받침
                  up_han_key.addClass("ko_gyeob_bat_chim");
                } else {
                  up_han_key.addClass("galma");
                }
              } else {
                ;
              }
            } else {
              // 한글 아랫글이 있을 때 넣어주었던 class 를 갈마들이를 넣으면서 빼준다
              if ((/3-p/.test(KO_type)) &&
                  (html_table[id]["true"][2] >= 0x3131) &&
                  (html_table[id]["true"][5] <= 0x314E) &&
                  (compatibility_hot.indexOf(html_table[id]["true"][5]) < 0)
                ) {
                // ko_alpha 를 가지고 있는다
              } else {
                down_en_key.removeClass("ko_alpha");
                down_en_key.addClass("galma");
              }
              down_en_key.html(html_table[id]["false"][4]);
            }
          }

          // 윗글에 대한 갈마들이가 있고 갈마들이가 한글 아랫글쇠와 다르다
          if ( html_table[id]["true"][4] &&
              (html_table[id]["true"][4] != html_table[id]["false"][1])
              ) {
            // 한글 아랫글이 있을 때 넣어주었던 class 를 갈마들이를 넣으면서 빼준다
            if ((/3-p/.test(KO_type)) &&
                (html_table[id]["true"][2] >= 0x3131) &&
                (html_table[id]["true"][5] <= 0x314E) &&
                (compatibility_hot.indexOf(html_table[id]["true"][5]) < 0)
              ) {
              // ko_alpha 를 가지고 있는다
            } else {
              down_en_key.removeClass("ko_alpha");
              down_en_key.addClass("galma");
            }
            down_en_key.html(html_table[id]["true"][4]);
          }
        } else {
          down_han_key.html("");
          up_han_key.html("");
        }//  if ((KE_status == 'ko') && hangeul_layout.length) {
      }// if (extension_steps) {
    }// if(typeof(html_table[id]) != "undefined") {
  });// $.each(keys, function(_, node) {


  /*** 각 배열마다 따로 들어가는 값이 있으면 여기서 넣는다 ***/
  if (KE_status == 'ko') {

    var tag_sign0 = "기호";
    var tag_sign1 = "기①";
    var tag_sign2 = "기②";
    var tag_yet1 = "한①";
    var tag_yet2 = "한②";
    var tag_moa_gawit_shift = "⇧";
    var tag_moa_ggeut_shift = "⇦";

    var node_key;
    if (!extension_steps && KE_status == 'ko') {
      if (left_bracket_araea) {
        // [ 자리의 [아래아] 를 다룬다
        node_key = $("#key_left_bracket .down_key .han_key");
        node_key.html("(ㆍ)");
        node_key.addClass("gawit_right");
        node_key.addClass("font08");
      }
      //if (/3shin-p1/.test(KO_type)) {
        //node_key = $("#key_forwardslash .up_key .han_key");
        // ㅋ 자리의 ㆍ(아래아) 를 다룬다
        //node_key.html("(ㆍ)");
        //node_key.addClass("gawit_right");
        //node_key.addClass("font08");
      //} else
      if ( (/3shin/.test(KO_type)) &&
          !(/3shin-b/.test(KO_type))
          ) {
        node_key = $("#key_forwardslash .up_key .han_key");
        // ㅋ 자리의 ㅗ 를 다룬다
        node_key.html("(ㅗ)");
        node_key.addClass("gawit_right");
        node_key.addClass("font08");
      }
      if (/3shin-p2/.test(KO_type)) {
        // ㅁ 자리의 ㅡ 를 다룬다
        node_key = $("#key_i .down_key .en_key");
        node_key.html("(ㅡ)");
        node_key.addClass("gawit_right");
        node_key.addClass("font08");
        // ㅊ 자리의 ㅜ 를 다룬다
        node_key = $("#key_o .down_key .en_key");
        node_key.html("(ㅜ)");
        node_key.addClass("gawit_right");
        node_key.addClass("font08");
        // ㅍ 자리의 ㆍ 아래아 를 다룬다
        node_key = $("#key_p .down_key .en_key");
        node_key.html("(ㆍ)");
        node_key.addClass("gawit_right");
        node_key.addClass("font08");
      }
    }

    if (extension_sign_keys.length) {
      if ((KO_type == '3-2011') || (KO_type == '3-2012')) {
        node_key = $("#key_v .down_key .en_key");
        node_key.html(tag_sign0);
        node_key.addClass("tag08 black");
        node_key = $("#key_eight .down_key .en_key");
        node_key.html(tag_sign0);
        node_key.addClass("tag08 black");
      } else if ((/3-2011-yet/.test(KO_type)) ||
                  (/3-2012-yet/.test(KO_type)) ||
                  (/3-2014/.test(KO_type)) ||
                  (/3-2015p/.test(KO_type)) ||
                  (/3-p2/.test(KO_type)) ||
                  (/3-p3/.test(KO_type))
                ) {
        node_key = $("#key_forwardslash .up_key .han_key");
        node_key.html(tag_sign1);
        node_key.addClass("tag08 black");
        node_key = $("#key_nine .up_key .han_key");
        node_key.html(tag_sign2);
        node_key.addClass("tag08 black");
      } else if (/3shin/.test(KO_type)) {
        if ((/2003/.test(KO_type)) ||
            (/2012/.test(KO_type)) ||
            (/-p/.test(KO_type) && !(yet_hangeul))
            ) {
          node_key = $("#key_j .down_key .en_key");
          node_key.html(tag_sign0);
          node_key.addClass("tag07 black");
          node_key = $("#key_k .down_key .en_key");
          node_key.html("①");
          node_key.addClass("tag09 black");
          node_key = $("#key_l .down_key .en_key");
          node_key.html("②");
          node_key.addClass("tag09 black");
          node_key = $("#key_semicolon .down_key .en_key");
          node_key.html("③");
          node_key.addClass("tag09 black");
        } else if (/-p/.test(KO_type) && yet_hangeul) {
          node_key = $("#key_f .down_key .en_key");
          node_key.html("받침");
          node_key.addClass("tag07 black");
          node_key = $("#key_a .down_key .en_key");
          node_key.html("ㆁ");
          node_key.addClass("tag09");
          node_key.removeClass("ko_alpha");
          node_key = $("#key_d .down_key .en_key");
          node_key.html("ㆆ");
          node_key.addClass("tag09");
          node_key.removeClass("ko_alpha");
          node_key = $("#key_q .down_key .en_key");
          node_key.html("ㅿ");
          node_key.addClass("tag09");
          node_key.removeClass("ko_alpha");

          node_key = $("#key_u .up_key .han_key");
          node_key.addClass("tag07");
          node_key = $("#key_y .up_key .han_key");
          node_key.addClass("tag07");
        }
      } else if (/3moa/.test(KO_type)) {
        if ((/semoe-2016/.test(KO_type))) {
          node_key = $("#key_j .down_key .en_key");
          node_key.html(tag_sign0);
          node_key.addClass("tag07 black");
          node_key = $("#key_k .down_key .en_key");
          node_key.html("①");
          node_key.addClass("tag09 black");
          node_key = $("#key_l .down_key .en_key");
          node_key.html("②");
          node_key.addClass("tag09 black");
          node_key = $("#key_semicolon .down_key .en_key");
          node_key.html("③");
          node_key.addClass("tag09 black");
        } else if ((/semoe-2017/.test(KO_type))) {
          node_key = $("#key_j .down_key .en_key");
          node_key.html(tag_sign0);
          node_key.addClass("tag07 black");
          node_key = $("#key_k .down_key .en_key");
          node_key.html("①");
          node_key.addClass("tag09 black");
          node_key = $("#key_l .down_key .en_key");
          node_key.html("②");
          node_key.addClass("tag09 black");
          node_key = $("#key_semicolon .down_key .en_key");
          node_key.html("③");
          node_key.addClass("tag09 black");
        }
      }

      if ((/yet/.test(KO_type)) &&
            (/3-2011/.test(KO_type) ||
            /3-2012/.test(KO_type) ||
            /3-2014/.test(KO_type) ||
            /3-2015p/.test(KO_type))
          ) {
        node_key = $("#key_seven .up_key .han_key");
        node_key.html(tag_yet1);
        node_key.addClass("tag08 black");
        node_key = $("#key_eight .up_key .han_key");
        node_key.html(tag_yet2);
        node_key.addClass("tag08 black");
        node_key = $("#key_seven .down_key .han_key");
        node_key.html("(ㅣ)");
        node_key.addClass("font08");
        node_key = $("#key_eight .down_key .han_key");
        node_key.html("(ㅡ)");
        node_key.addClass("font08");
      }
    }//if (extension_sign_keys.length) {

    if (/3moa-semoe/.test(KO_type)) {
      if (KO_type == '3moa-semoe-2014') {
        node_key = $("#key_semicolon .down_key .han_key");
        node_key.html(tag_moa_ggeut_shift);
        node_key.addClass("tag09");
      } else if (KO_type == '3moa-semoe-2015') {
        node_key = $("#key_p .up_key .han_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key = $("#key_v .up_key .en_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key.removeClass("ko_alpha");
        node_key = $("#key_semicolon .up_key .han_key");
        node_key.html(tag_moa_ggeut_shift);
        node_key.addClass("tag09");
      } else if (KO_type == '3moa-semoe-2016') {
        node_key = $("#key_left_bracket .up_key .han_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key = $("#key_v .up_key .en_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key.removeClass("ko_alpha");
        node_key = $("#key_semicolon .up_key .han_key");
        node_key.html(tag_moa_ggeut_shift);
        node_key.addClass("tag09");
      } else {
        node_key = $("#key_period .up_key .han_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key = $("#key_v .up_key .en_key");
        node_key.html(tag_moa_gawit_shift);
        node_key.addClass("tag09");
        node_key.removeClass("ko_alpha");
        node_key = $("#key_semicolon .up_key .han_key");
        node_key.html(tag_moa_ggeut_shift);
        node_key.addClass("tag09");
      }
    }

  }//if (KE_status == 'ko')


  // html 글판 그림을 눌렀을 때 한글을 넣는다
  // 이 함수는 글판이 바뀔 때마다 묶인다. 그래서 앞서 묶어놓은 것은 풀어준다
  $("div.keyboard div.key").unbind( "click" );
  if (tadak_tadak == false) {
    $('div.keyboard div.key').bind("click", function(){
      var current_id = $(this).attr('id');
      var array_id = current_id.split("_");
      var name = array_id[array_id.length - 1];
  // 넣자
  //caps_lock_on
  //key_caps_lock
      if(name == "shift") {
        if ($(this).hasClass("shift_pressed")) {
          shift_on = false;
          $(this).removeClass("shift_pressed");
        } else {
          shift_on = true;
          $(this).addClass("shift_pressed");
        }
      } else if(name == "lock") {
        if ($(this).hasClass("capslock_pressed")) {
          caps_lock_on = false;
          $(this).removeClass("capslock_pressed");
        } else {
          caps_lock_on = true;
          $(this).addClass("capslock_pressed");
        }
      } else {
        $(this).addClass("pressed");
        $(".key.shift_pressed").removeClass("shift_pressed");
      }

      click_html_keymap(current_id);
    });
  }
}

function click_html_keymap(current_id) {
  var index = -1;
  var value;
  var up_down;
  if (caps_lock_on && shift_on) {
    up_down = 'false';
  } else if (caps_lock_on && !(shift_on)) {
    up_down = 'true';
  } else if (!(caps_lock_on) && shift_on) {
    up_down = 'true';
  } else {
    up_down = 'false';
  }

  for(index = 0; index < 94; index++) {
    value = html_map_layout[index];
    if(value[0] == current_id) {
      if(value[1] == up_down) {
        break;
      }
    }
  }

  if(index > -1 && index < 94) {
    //var value = hangeul_layout[index];
    var keyCode = html_map_layout[index][3];
    ohi_Hangeul_Process(keyCode);
    ohi_Hangeul_Process(0x0000);
  } else {
    if (extension_steps > 0) {
      if (current_id != 'key_backspace') {
        ohi_Backspace();
      }
      extension_steps = 0;
      mapping_layout_to_html(0);
      ohiQ = OHIQ_INIT;
    }
    if (current_id == 'key_backspace') {
      ohi_Backspace();
    } else if (current_id == 'key_space') {
      ohi_Insert(ohiQ, 0x20);
    } else if (current_id == 'key_enter') {
      ohi_Insert(ohiQ, 0x0d);
    } else if (current_id == 'key_tab') {
      ohi_Insert(ohiQ, 0x09);
    }
  }

  // 눌렸던 html 글쇠를 풀어준다
  if($(".pressed").length) {
    $(".key.pressed").removeClass("pressed");
    shift_on = false;
  }
};

function change_KE_status(lang) {
  var index = findIndexByKeyValue(layout_list_info_ke, 'name', KE_status);

  if (typeof(lang) == 'undefined') {
    // 정하지 않으면 목록에서 바로 다음에 있는 것으로 바꾼다
    if ((index < 0) || (index == layout_list_info_ke.length - 1)) {
      index = 0;
    } else {
      index += 1;
    }
    KE_status = layout_list_info_ke[index].name;
  } else {
    index = findIndexByKeyValue(layout_list_info_ke, 'name', lang);
    if (index >= 0) {
      KE_status = layout_list_info_ke[index].name;
    } else {
      index = findIndexByKeyValue(layout_list_info_ke, 'name', KE_status);
    }
  }
  mapping_layout_to_html(0);

  $.each (layout_list_info_ke, function (index, item) {
    if (KE_status == item.name) {
      $(".layout_select_lang option[value="+KE_status+"]").prop("selected", true);
    } else {
      $(".layout_select_lang option[value="+item.name+"]").prop("selected", false);
    }
  });


  // selecter 에서 한영의 상태가 바뀌면 호출된다
  $(".layout_select_lang").change(function(){
    var value = $(".layout_select_lang option:selected").selectpicker('val');
    if (value.length) {
      $.each (value, function (index, item) {
        if (KE_status != item.value) {
          change_KE_status(item.value);
        }
      });
    } else {
      change_KE_status(KE_status);
    }

    ohi_Insert(ohiQ, 0);
  });
}

function change_EN_type(type) {
  var index = findIndexByKeyValue(layout_list_info_en, 'name', EN_type);
  if (typeof(type) == 'undefined') {
    // 배열을 정하지 않으면 목록에서 바로 다음에 있는 것으로 바꾼다
    if ((index < 0) || (index == layout_list_info_en.length - 1)) {
      index = 0;
    } else {
      index += 1;
    }
    EN_type = layout_list_info_en[index].name;
  } else {
    index = findIndexByKeyValue(layout_list_info_en, 'name', type);
    if (index >= 0) {
      EN_type = layout_list_info_en[index].name;
    } else {
      index = findIndexByKeyValue(layout_list_info_en, 'name', EN_type);
    }
  }

  english_layout = get_table_english(EN_type);
  mapping_layout_to_html(0);

  $.each (layout_list_info_en, function (index, item) {
    if (EN_type == item.name) {
      $(".layout_select_en option[value="+EN_type+"]").prop("selected", true);
    } else {
      $(".layout_select_en option[value="+item.name+"]").prop("selected", false);
    }
  });

  $(".layout_select_en").change(function(){
    var value = $(".layout_select_en option:selected").selectpicker('val');
    if (value.length) {
      $.each (value, function (index, item) {
        if (EN_type != item.value) {
          change_EN_type(item.value);
        }
      });
    } else {
      change_EN_type(EN_type);
    }

    ohi_Insert(ohiQ, 0);
  });
}

function change_KO_type(type) {
  var index = findIndexByKeyValue(layout_list_info_ko, 'name', KO_type);
  if (typeof(type) == 'undefined') {
    // 배열을 정하지 않으면 목록에서 바로 다음에 있는 것으로 바꾼다
    if ((index < 0) || (index == layout_list_info_ko.length - 1)) {
      index = 0;
    } else {
      index += 1;
    }
    KO_type = layout_list_info_ko[index].name;
  } else {
    index = findIndexByKeyValue(layout_list_info_ko, 'name', type);
    if (index >= 0) {
      KO_type = layout_list_info_ko[index].name;
    } else {
      index = findIndexByKeyValue(layout_list_info_ko, 'name', KO_type);
    }
  }

  hangeul_layout = get_table_hangeul(KO_type);
  hangeul_combination = get_table_combination(KO_type);
  right_ou_keys = layout_list_info_ko[index].right_ou_keys;
  if (right_ou_keys) {
    ;
  } else {
    right_ou_keys = [];
  }
  left_bracket_araea = layout_list_info_ko[index].left_bracket_araea;
  if (left_bracket_araea) {
    ;
  } else {
    left_bracket_araea = false;
  }

  // 글판의 갈마들이가 참이면 갈마들이 규칙을 불러온다
  if (layout_list_info_ko[index].galmadeuli) {
    galmadeuli_layout = get_table_galmadeuli(KO_type);
    if (galmadeuli_layout.length) {
      ;
    } else {
      galmadeuli_layout = [];
    }
  } else {
    galmadeuli_layout = [];
  }

  // 글판의 기호확장이 참이면 기호배열을 불러온다
  extension_sign_keys = layout_list_info_ko[index].extension_sign_keys;
  if (extension_sign_keys && extension_sign_keys.length) {
    extension_sign_layout  = get_table_extension(1, KO_type);

    // 글판이 기호확장 목록에 있으면 기호배열을 불러온 뒤에
    // 옛글확장 목록에 있으면 옛글확장 배열을 불러온다
    extension_yetgeul_keys = layout_list_info_ko[index].extension_yetgeul_keys;
    if (extension_yetgeul_keys && extension_yetgeul_keys.length) {
      extension_yetgeul_layout = get_table_extension(2, KO_type);
    } else {
      extension_yetgeul_keys = [];
    }
  } else {
    // 글판이 기호확장 목록에 없으면 관련된 값을 모두 초기화한다
    extension_sign_keys = [];
    extension_sign_layout = [];
    extension_yetgeul_keys = [];
    extension_yetgeul_layout = [];
  }

  // 글판의 줄여넣기를 불러온다

  if (layout_list_info_ko[index].shortening == true) {
    shortening = true;
    shortening_layout = get_table_shortening(KO_type);
  } else {
    shortening = false;
    shortening_layout = {};
  }

  // 필요한 값을 모두 얻은 뒤에 html 글판을 새로 고친다
  mapping_layout_to_html(0);

  // layout_option 에 있는 것들의 상태를 다룬다
    // 바꾼 뒤에 끈다
  $('#toggle_shoot_at_once').prop('checked', false).change()
  $("#toggle_shoot_at_once").bootstrapToggle('disable');
  $('#toggle_yet_hangeul').prop('checked', false).change()
  $("#toggle_yet_hangeul").bootstrapToggle('disable');
  $(".documentation div").addClass('hidden');
  if (/3moa/.test(KO_type)) {
    // 켠 뒤에 바꾼다
    $("#toggle_shoot_at_once").bootstrapToggle('enable');
    $('#toggle_shoot_at_once').prop('checked', true).change()
    shoot_at_once = $('#toggle_shoot_at_once').is(":checked");
    $(".documentation div.3moa").removeClass('hidden');
  } else if (/3shin-p1/.test(KO_type)) {
    // 켠 뒤에 바꾼다
    $("#toggle_yet_hangeul").bootstrapToggle('enable');
    $('#toggle_yet_hangeul').prop('checked', false).change()
    $(".documentation div.3shin").removeClass('hidden');
  } else if (/3shin-p2/.test(KO_type)) {
	$(".documentation div.3shin").removeClass('hidden');
  } else {
    $(".documentation div.general").removeClass('hidden');
  }

  $("#toggle_shoot_at_once").change(function(){
    shoot_at_once = $(this).is(":checked");
    ohi_Insert(ohiQ, 0);
  });
  $("#toggle_yet_hangeul").change(function(){
    yet_hangeul = $(this).is(":checked");
    ohi_Insert(ohiQ, 0);
    // 요즘한글, 옛한글의 상태가 바뀌면 배열과 조합규칙을 새로 불러온다
    hangeul_layout = get_table_hangeul(KO_type, yet_hangeul);
    hangeul_combination = get_table_combination(KO_type, yet_hangeul);
    mapping_layout_to_html(0);
  });

  // 배열의 이름 뿐이 아니라 다른 정보도 다루기 위해서
  $.each (layout_list_info_ko, function (index, item) {
    if (KO_type == item.name) {
      $(".layout_select_ko option[value="+KO_type+"]").prop("selected", true);
      if(typeof(item.link) != 'undefined') {
        $(".layout_link a").attr('href', item.link).show();
      } else {
        $(".layout_link a").attr('href', '').hide();
      }
    } else {
      $(".layout_select_ko option[value="+item.name+"]").prop("selected", false);
    }
  });

  // selecter 에서 한글 글판이 바뀌면 호출된다
  $(".layout_select_ko").change(function(){
    extension_steps = 0;
    ohi_Insert(ohiQ, 0);

    var value = $(".layout_select_ko option:selected").selectpicker('val');
    if (value.length) {
      $.each (value, function (index, item) {
        if (KO_type != item.value) {
          change_KO_type(item.value);
        }
      });
    } else {
      change_KO_type(KO_type);
    }

    //true:글판이 바뀌었다. 글판 익히기 배열을 다시 불러온다.
    reset_taja_key(true);
  });
}

function change_status(lang, type_en, type_ko) {
  change_KE_status(lang);
  change_EN_type(type_en);
  change_KO_type(type_ko);
}

function add_layout_list() {
  /** html layout info **/
  var name;
  var index = -1;

  // 한영을 넣는다
  $.each (layout_list_info_ke, function (index, item) {
    $(".layout_select_lang").append($('<option>', {
      value: item.name,
      html: item.full_name
    }));
    if (KE_status == item.name) {
      $(".layout_select_lang option[value="+KE_status+"]").prop("selected", true);
    }
  });

  // 영문 글판을 넣는다
  $.each (layout_list_info_en, function (index, item) {
    $(".layout_select_en").append($('<option>', {
      value: item.name,
      html: item.full_name
    }));
    if (EN_type == item.name) {
      $(".layout_select_en option[value="+EN_type+"]").prop("selected", true);
    }
  });

  // 한글 글판을 넣는다
  $.each (layout_list_info_ko, function (index, item) {
    if(item.name.substr(0, 1) == '2') {
      name = '[두벌식] ';
    } else if(item.name.substr(0, 1) == '3') {
      name = '[세벌식] ';
    } else {
      name = '';
    }

    name += item.full_name;
    if(item.name == '3-2011' || item.name == '3-91') {
      name+=' (문장)';
    }

    if (item.position == "머리") {
      $(".layout_select_ko [label='머리']").append($('<option>', {
        value: item.name,
        html: name
      }));
    } else if (item.position == "팔") {
      $(".layout_select_ko [label='팔']").append($('<option>', {
        value: item.name,
        html: name
      }));
    } else if (item.position == "허리") {
      $(".layout_select_ko [label='허리']").append($('<option>', {
        value: item.name,
        html: name
      }));
    } else {
      $(".layout_select_ko [label='다리']").append($('<option>', {
        value: item.name,
        html: name
      }));
    }

    if (KO_type == item.name) {
      $(".layout_select_ko option[value="+KO_type+"]").prop("selected", true);
    }
  });
}

function url_query() {
  var return_url = {ke_status:0, en_type:0, ko_type:0}
  var field, value;
  var address = unescape(location.href);
  var fields = [];
  var option = address.indexOf('?');
  if (option >= 0) {
    fields = (address.slice(option + 1, address.length)).split('&');
  }

  for(var i in fields){
    field = fields[i].split('=')[0].toLowerCase();
    value = fields[i].split('=')[1].toLowerCase();
    if((typeof(value) == 'undefined') || !value) {
      continue;
    }

    if (field == 'ke')    {
      return_url.ke_status = value;
    } else if (field == 'en') {
      return_url.en_type = value;
    } else if (field == 'ko') {
      return_url.ko_type = value;
    }
  }

  return return_url;
}

function ohiStart (lang, type) {
  $(document).bind('click touchstart', function () {
    if (tadak_tadak) {
      return;
    }
    setTimeout(function () {
      inputText_focus().focus();
    }, 100);
  });

  // 글판 목록을 html select 에 넣는다
  add_layout_list();
  browser_detect();
  inputText_focus();

  var url = url_query();

  // 시작할 때 글판을 불러온다
  url.ke_status = url.ke_status || KE_status;
  url.en_type = url.en_type || EN_type;
  url.ko_type = url.ko_type || KO_type;
  change_status(url.ke_status, url.en_type, url.ko_type);
}
