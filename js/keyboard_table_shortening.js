function get_table_shortening(type) {
  // 값이 작은 것에서 큰 것의 순서로 넣어야 한다
  var K3_3moa_2015 = {
    "0x110211B8": [0x11b8,0x1102,0x1175,0x1103,0x1161], // ㅂ(3) + ㄴ(1) = ㅂ니다
    "0x110B11B8": [0x110b,0x1175,0x11b8,0x1102,0x1175,0x1103,0x1161], // ㅇ(1) + ㅂ(3) = 입니다
    "0x110C111211AB": [0x1112,0x1161,0x110c,0x1175,0x1106,0x1161,0x11ab], // ㅎ(1) + ㅈ(1) + ㄴ(3) = 하지만
  };

  switch (true) {
    case /3moa-2015/.test(type) :
      return K3_3moa_2015;
    default :
      return [];
  }
}