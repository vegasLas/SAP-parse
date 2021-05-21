const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');


let xhr = new XMLHttpRequest(),
  code,
  ast,
  result = "";
xhr.open(
  "GET",
  "https://raw.githubusercontent.com/SAP-samples/s4hana-ext-deploy-custom-ui/master/webapp/controller/Detail.controller.js",
  true
)
xhr.send();
xhr.onload = function () {
  if (xhr.status != 200) { }
  else {
    code = xhr.responseText
    ast = parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "flow",
      ],
    })
    // Я не совсем понял ваше условие, я пытался взять ваш контакт у рекрутера,
    // чтобы задать вопросы  мне сказали, что вы не комментируете тз,
    // Если я допустил опдошность, дайте обратную связь, будь те добры 
    // Задание 1 
    traverse.default(ast, {
      enter(path) {
        if (path.isObjectProperty() &&
          path.node.value.body &&
          path.node.value.body.body.some(o => o.type === "IfStatement" || "ReturnStatement"
          )) {
          path.node.value.body.body.some(o => o.type === "ReturnStatement") ?
            result += `${path.node.key.name};\n` :
            path.node.value.body.body.some(o => o.type === "IfStatement") &&
              path.node.value.body.body.find(o => o.type === "IfStatement").consequent.body.some(o => o.type === "ReturnStatement") ?
              result += `${path.node.key.name};\n` :
              null
        }
      }
    });
    // Эадание 2
    // traverse.default(ast, {
    //   enter(path) {
    //     if (path.isObjectProperty() &&
    //       path.node.value.params &&
    //       path.node.value.params.length > 0
    //     )
    //       result += `${path.node.key.name}: ${path.node.value.params.length} \n`
    //   }
    // });
    console.log(result)
  }
}

new Promise(function (res, rej) {
  if (result) {
    res(result)
  }
}).then(res => console.log(res))
