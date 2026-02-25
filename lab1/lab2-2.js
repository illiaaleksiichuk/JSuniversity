// ip adress //
function isIPAddress(ip) {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}
// Логіка перевірки числа (0-255)
// Кожна група в дужках (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) відповідає за одне число.
// Весь вираз виглядає так: ^ [Число 0-255] \. [Число 0-255] \. [Число 0-255] \. [Число 0-255] $

//  rgb  //
function findRGBA(text) {
  // Регулярний вираз для пошуку rgba(r, g, b, a)
  // \s* дозволяє ігнорувати пробіли між числами та комами
  const rgbaRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0\.\d+)\s*\)/;

  const match = text.match(rgbaRegex);

  // Якщо знайдено, повертаємо перший збіг, інакше — null
  return match ? match[0] : null;
}

//Hex кольору (#ABC або #ABCDEF)
const findHexColor = (text) => {
  const regex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/;
  const match = text.match(regex);
  return match ? match[0] : null;
};

//Пошук усіх тегів з заданим ім'ям
const findTags = (text, tag) => {
  const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return text.match(regex) || [];
};

//Пошук усіх додатних чисел
const findPosNum = (text) => {
  // Знаходить цілі числа та числа з комою, що є додатними
  const regex = /(?<!-)\b\d+(?:\.\d+)?\b/g;
  const matches = text.match(regex);
  return matches ? matches.map(Number) : [];
};

//Пошук дат у форматі РРРР-ММ-ДД
const findDates = (text) => {
  const regex = /\b\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/g;
  return text.match(regex) || [];
};

//Пошук коректних email адрес
const findEmail = (text) => {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(regex) || [];
};
