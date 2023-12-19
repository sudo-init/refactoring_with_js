// import statement from "./example_1"
// import assert from "asert";
import { strictEqual } from 'assert';
// import {readJsonFile, statement} from "./example_1.js"
import {readJsonFile, statement} from "./example_1.js";


// const example_1_test = 
// statement
// const n = 10;

// describe("example 1 Test", () => {
//     let result = 10;
//     const msg = result === 10 ? "통과" : "실패";
//     it(msg, () => {
//         strictEqual(10, n);
//     });
    
// });



describe("example 1 Test", () => {
    const invoice = readJsonFile("invoices.json")[0];
    const plays = readJsonFile("plays.json");
    const result = statement(invoice, plays);
    let expected = ["청구내역 (고객명: BigCo)",
                    " hamlet: $650.00 (55석)",
                    " As You Like It: $580.00 (35석)",
                    " Othello: $500.00 (40석)",
                    "총액: $1,730.00",
                    "적립 포인트: 47점"
    ].join('\n');
    const msg = result === expected ? "통과" : "실패";
    it(msg, () => {
        strictEqual(result, expected);
    });

});