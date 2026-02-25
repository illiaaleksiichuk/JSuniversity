// 2
console.log("--- Тестування camelize ---");
console.log(camelize("background-color"));
console.log(camelize("list-style-image"));
console.log(camelize("-webkit-transition"));

// 9
const list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null,
      },
    },
  },
};

console.log("--- Вивід циклом (1, 2, 3, 4) ---");
printList(list);

console.log("--- Вивід рекурсією (1, 2, 3, 4) ---");
printListRec(list);

console.log("--- Зворотний вивід рекурсією (4, 3, 2, 1) ---");
printReverseListRec(list);

console.log("--- Зворотний вивід циклом (4, 3, 2, 1) ---");
printReverseList(list);
