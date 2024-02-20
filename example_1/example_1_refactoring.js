/*
    1. 함수 쪼개기
    2. 임시 변수를 질의 함수로 바꾸기 & 변수 인라인하기
        - 중간에 계산된 필요한 값을 저장하는 임시 변수를 사용하는 대신 
          해당 내용을 함수로 추출하여 함수를 호출하고, 값을 리턴받는 방식으로 변환.
          추출된 함수를 변수 자리에 대체해줌 (변수 인라인하기)
        

    for 안에 있는 코드 리팩토링하기
        1. 반복문 쪼개기 (변수 값을 누적시키는 부분을 분리. for을 두 번 써서 분리되도록)
        2. 문장 슬라이드하기 (변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮김)
        3. 함수 추출하기 (계산하는 부분(for문과 변수 초기화 부분)을 별도의 함수로 추출)
        4. 변수 인라인하기 (임시 변수를 지우고, 임시 변수 자리에 함수를 바로 써준다.)
    반복문이 중복되면 성능이 느려지지 않을까 걱정할 수 있지만,
    이 정도의 중복은 성능에 미치는 영향이 미미할 때가 많다.

    때로는 리팩터링이 성능에 상당한 영향을 주기도 한다.
    그런 경우라도 개의치 않고 리팩터링을 한다.
    잘 다듬어진 코드라야 성능 개선 작업도 훨씬 수월하기 때문이다.
    리팩터링 과정에서 성능이 크게 떨어졌다면, 리팩터링 후 시간을 내어 성능을 개선한다.

    리팩터링으로 인한 성능의 문제에 대한 태도
    => 특별한 경우가 아니라면 일단 무시한다.
*/

// Test 명령어 : npm run test_refactor
    

import { readFile, readFileSync } from 'fs';


export function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformances);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformances(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;
            
        switch (aPerformance.play.type) {
            case "tragedy" : 
            result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy" : 
            result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) {
            result += Math.floor(aPerformance.audience / 5);
        }
        return result;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }
}



function renderPlainText(data) {
    let result = `청구내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`
    }
    result += `총액: ${usd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
        {
            style: "currency", 
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }
}


export function readJsonFile(filePath) {
    try {
      // 파일을 동기적으로 읽어옴
      const data = readFileSync(filePath, 'utf8');

      // JSON 형식으로 파싱
      const jsonData = JSON.parse(data);
  
      return jsonData;
    } catch (error) {
      // 오류 발생 시 처리
      console.error(`Error reading JSON file: ${error.message}`);
      return null;
    }
  }

const readJson = (jsonFilePath) => {   // 비동기로 파일 읽어오기.
    // JSON 파일 경로 지정
    // const jsonFilePath = 'path/to/your/file.json';

    // 파일 읽기
    readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return;
        }

        try {
            // JSON 문자열을 JavaScript 객체로 변환
            const jsonData = JSON.parse(data);

            // 여기에서 jsonData를 사용하여 작업을 수행합니다.
            console.log('함수 내부', jsonData);
            return jsonData;
        } catch (jsonError) {
            console.error('JSON 파일을 파싱하는 중 오류가 발생했습니다.', jsonError);
        }
    });
}


