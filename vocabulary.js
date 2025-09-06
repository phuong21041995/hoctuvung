// vocabulary.js
const VOCABULARY_SETS = {
  "dong_vat": {
    name: "Các loài Động vật 🐾",
    words: [
      { vi: 'chó', en: 'Dog', ko: '개', sound: 'gâu gâu' },
      { vi: 'mèo', en: 'Cat', ko: '고양이', sound: 'meo meo' },
      { vi: 'gà', en: 'Chicken', ko: '닭', sound: 'cục tác' },
      { vi: 'vịt', en: 'Duck', ko: '오리', sound: 'quạc quạc' },
      { vi: 'bò', en: 'Cow', ko: '소', sound: 'ùm bò' },
      { vi: 'heo', en: 'Pig', ko: '돼지', sound: 'ụt ịt' },
      { vi: 'cừu', en: 'Sheep', ko: '양', sound: 'be be' },
      { vi: 'ngựa', en: 'Horse', ko: '말', sound: 'hí hí' },
      { vi: 'voi', en: 'Elephant', ko: '코끼리', sound: 'phì phì' },
      { vi: 'khỉ', en: 'Monkey', ko: '원숭이', sound: 'khẹc khẹc' },
      { vi: 'sư tử', en: 'Lion', ko: '사자', sound: 'gầm' },
      { vi: 'hổ', en: 'Tiger', ko: '호랑이', sound: 'gầm gừ' },
      { vi: 'gấu', en: 'Bear', ko: '곰', sound: 'gừ' },
      { vi: 'cáo', en: 'Fox', ko: '여우' },
      { vi: 'thỏ', en: 'Rabbit', ko: '토끼' },
      { vi: 'hươu cao cổ', en: 'Giraffe', ko: '기린' },
      { vi: 'gấu trúc', en: 'Panda', ko: '판다' },
      { vi: 'ngựa vằn', en: 'Zebra', ko: '얼룩말' },
      { vi: 'cá heo', en: 'Dolphin', ko: '돌고래' },
      { vi: 'cá mập', en: 'Shark', ko: '상어' },
      { vi: 'bạch tuộc', en: 'Octopus', ko: '문어' },
      { vi: 'rùa', en: 'Turtle', ko: '거북이' },
      { vi: 'chim cánh cụt', en: 'Penguin', ko: '펭귄' },
      { vi: 'ếch', en: 'Frog', ko: '개구리', sound: 'ộp ộp' },
      { vi: 'rắn', en: 'Snake', ko: '뱀', sound: 'xì' },
      { vi: 'ong', en: 'Bee', ko: '벌', sound: 'vo ve' }
    ]
  },
  "thuc_vat": {
    name: "Các loại Thực vật 🌳",
    words: [
      { vi: 'cà rốt', en: 'Carrot', ko: '당근' },
      { vi: 'cà chua', en: 'Tomato', ko: '토마토' },
      { vi: 'quả táo', en: 'Apple', ko: '사과' },
      { vi: 'quả cam', en: 'Orange', ko: '오렌지' },
      { vi: 'quả dưa hấu', en: 'Watermelon', ko: '수박' },
      { vi: 'bông cải xanh', en: 'Broccoli', ko: '브로콜리' },
      { vi: 'cây nấm', en: 'Mushroom', ko: '버섯' },
      { vi: 'củ khoai tây', en: 'Potato', ko: '감자' },
      { vi: 'bắp ngô', en: 'Corn', ko: '옥수수' },
      { vi: 'quả dâu tây', en: 'Strawberry', ko: '딸기' },
      { vi: 'quả nho', en: 'Grape', ko: '포도' },
      { vi: 'quả chanh', en: 'Lemon', ko: '레몬' },
      { vi: 'hành tây', en: 'Onion', ko: '양파' },
      { vi: 'củ tỏi', en: 'Garlic', ko: '마늘' },
      { vi: 'quả ớt', en: 'Chili pepper', ko: '고추' },
      { vi: 'quả dứa', en: 'Pineapple', ko: '파인애플' },
      { vi: 'quả bơ', en: 'Avocado', ko: '아보카도' },
      { vi: 'quả dưa chuột', en: 'Cucumber', ko: '오이' }
    ]
  },
  "do_vat": {
    name: "Đồ vật Quen thuộc ✏️",
    words: [
      { vi: 'cái bàn', en: 'Table', ko: '책상' },
      { vi: 'cái ghế', en: 'Chair', ko: '의자' },
      { vi: 'quyển sách', en: 'Book', ko: '책' },
      { vi: 'cây bút', en: 'Pen', ko: '펜' },
      { vi: 'cái giường', en: 'Bed', ko: '침대' },
      { vi: 'ô tô', en: 'Car', ko: '자동차' },
      { vi: 'xe đạp', en: 'Bicycle', ko: '자전거' },
      { vi: 'máy bay', en: 'Airplane', ko: '비행기' },
      { vi: 'ngôi nhà', en: 'House', ko: '집' },
      { vi: 'cái cốc', en: 'Cup', ko: '컵' },
      { vi: 'quả bóng', en: 'Ball', ko: '공' },
      { vi: 'tivi', en: 'Television', ko: '텔레비전' },
      { vi: 'điện thoại', en: 'Phone', ko: '전화기' },
      { vi: 'máy tính', en: 'Computer', ko: '컴퓨터' },
      { vi: 'đồng hồ', en: 'Clock', ko: '시계' },
      { vi: 'chìa khóa', en: 'Key', ko: '열쇠' },
      { vi: 'cái mũ', en: 'Hat', ko: '모자' },
      { vi: 'đôi giày', en: 'Shoes', ko: '신발' },
      { vi: 'cái bát', en: 'Bowl', ko: '그릇' },
      { vi: 'cửa sổ', en: 'Window', ko: '창문' },
      { vi: 'cửa ra vào', en: 'Door', ko: '문' }
    ]
  }
};

