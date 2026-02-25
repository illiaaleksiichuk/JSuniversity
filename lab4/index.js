function query(collection, ...operations) {
  // копія колекції (щоб не змінювати оригінал)
  let result = collection.map((item) => ({ ...item }));

  if (operations.length === 0) return result;

  // ================= FILTER =================
  const filterOps = operations.filter((op) => op.type === "filterIn");

  for (let op of filterOps) {
    result = result.filter((item) => op.values.includes(item[op.field]));
  }

  // ================= SELECT =================
  const selectOps = operations.filter((op) => op.type === "select");

  if (selectOps.length > 0) {
    // перетин полів
    let fields = selectOps[0].fields.slice();

    for (let i = 1; i < selectOps.length; i++) {
      fields = fields.filter((f) => selectOps[i].fields.includes(f));
    }

    result = result.map((item) => {
      let newObj = {};
      for (let field of fields) {
        if (field in item) {
          newObj[field] = item[field];
        }
      }
      return newObj;
    });
  }

  return result;
}

function select(...fields) {
  return {
    type: "select",
    fields,
  };
}

function filterIn(field, values) {
  return {
    type: "filterIn",
    field,
    values,
  };
}
