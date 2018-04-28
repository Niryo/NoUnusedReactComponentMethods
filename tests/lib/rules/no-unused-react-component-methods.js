/**
 * @fileoverview No unused React component methods
 * @author Nir
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unused-react-component-methods"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
RuleTester.setDefaultConfig({
"parser": "babel-eslint",
  parserOptions: {
    ecmaVersion: 6
  }
});
var ruleTester = new RuleTester();

ruleTester.run("no-unused-react-component-method", rule, {

    valid: [
       {code: `
        class SomeClass extends React.Component {
          static someStaticVar = true;
          foo = () => {}
          bar(){}
        
          componentWillMount(){}
          componentDidMount(){}
          componentWillUpdate(){}
          componentDidUpdate(){}
          render(){}
          propTypes(){}
          componentWillReceiveProps(){}
          shouldComponentUpdate(){}
          componentWillUnmount(){}

          render() {
              this.foo();
              this.bar();
          }
        }
       `},
       {code: `
        class SomeClass extends PureComponent {
          static someStaticVar = true;
          foo = () => {}
          bar(){}

          render() {
              this.foo();
              this.bar();
          }
        }
       `},
       {code: `
       class SomeClass extends Component {
         static someStaticVar = true;
         foo = () => {}
         bar(){}

         render() {
             this.foo();
             this.bar();
         }
       }
      `}
    ],

    invalid: [
        {
            code:  `
            export default class SomeClass extends React.Component {
               bar(){}
             }
            `,
            errors: [{
                message: "bar is defined but never used",
                type: "MethodDefinition"
            }]
        },
        {
            code:  `export default class SomeClass extends React.Component {bar = () => {}}`,
            errors: [{
                message: "bar is defined but never used",
                type: "ClassProperty"
            }]
        }
    ]
});
