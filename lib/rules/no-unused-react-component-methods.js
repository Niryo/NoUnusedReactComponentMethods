/**
 * @fileoverview Rule to flag declared but unused methods inside a react component
 * @author Nir
 */
"use strict";

module.exports = {
  meta: {
    docs: {
      description: "Disallow unused methods in react components",
      category: "Best Practices",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create: function (context) {
    function isReactComponent(node, context) {
      if (!node.superClass) {
        return false;
      }
      return /^(React\.)?(Pure)?Component$/.test(context.getSourceCode().getText(node.superClass));
    }


    const ignoreMethods = [
      'componentWillMount',
      'componentDidMount',
      'componentWillUpdate',
      'componentDidUpdate',
      'render',
      'propTypes',
      'componentWillReceiveProps',
      'shouldComponentUpdate',
      'componentWillUnmount',
    ]
    let methods = {};

    function addMethod(methodName, node) {
      if (methods[methodName]) {
        methods[methodName].node = node;
      } else {
        methods[methodName] = { node, methodName, isUsed: false };
      }
    }

    function getUnusedMethods(){
      return Object.keys(methods)
      .filter(key => !methods[key].isUsed)
      .filter(key => !ignoreMethods.includes(methods[key].methodName))
      .map(key => methods[key]);
    }
   
    return {
      'MethodDefinition': (node) => {
        addMethod(node.key.name, node);
      },
      'ClassProperty': (node) => {
        //ignore static class properties
        if(!node.static){
          addMethod(node.key.name, node);
        }
      },
      'MemberExpression': (node) => {
        if (node.object.type === 'ThisExpression') {
          const methodName = node.property.name;
          if (!methods[methodName]) {
            addMethod(methodName);
          }
          methods[methodName].isUsed = true;
        }
      },
      'ClassDeclaration:exit': (node) => {
        if (isReactComponent(node, context)) {
          const unusedMethods = getUnusedMethods();
          unusedMethods.forEach(method => context.report({
            node: method.node,
            message: `${method.methodName} is defined but never used`
          }));
        }
        methods = {};
      }
    };
  }
};
