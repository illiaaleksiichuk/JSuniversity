function camelize(str) {
  return str
    .split("-") // Розбиваємо рядок на масив за дефісом
    .map((word, index) => {
      // Якщо це перше слово і воно не було порожнім (випадок "-webkit"),
      // залишаємо як є. Якщо ні - робимо першу літеру великою.
      if (index === 0) {
        return word;
      }

      if (!word) return ""; // Обробка подвійних дефісів, якщо вони є

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(""); // Збираємо масив назад у рядок
}

// 1. Виведення списку через цикл while
function printList(list) {
  let current = list;
  while (current) {
    console.log(current.value);
    current = current.next; // переходимо до наступного об'єкта
  }
}

// 2. Виведення списку через рекурсію
function printListRec(list) {
  console.log(list.value); // друкуємо поточне значення

  if (list.next) {
    printListRec(list.next); // викликаємо саму себе для наступного елемента
  }
}

// 3. Зворотний вивід через рекурсію
function printReverseListRec(list) {
  if (list.next) {
    printReverseListRec(list.next); // спочатку йдемо до самого кінця
  }
  // коли "повертаємось" з рекурсії — друкуємо
  console.log(list.value);
}

// 4. Зворотний вивід через цикл
function printReverseList(list) {
  let stack = [];
  let current = list;

  // Оскільки ми не можемо йти назад, спочатку записуємо все в масив
  while (current) {
    stack.push(current.value);
    current = current.next;
  }

  // Тепер виводимо масив з кінця до початку
  for (let i = stack.length - 1; i >= 0; i--) {
    console.log(stack[i]);
  }
}
