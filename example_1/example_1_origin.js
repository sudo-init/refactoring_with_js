
import { readFile, readFileSync } from 'fs';


export function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구내역 (고객명: ${invoice.customer})\n`;
    
    const format = new Intl.NumberFormat("en-US",
                    {
                        style: "currency", 
                        currency: "USD",
                        minimumFractionDigits: 2
                    }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID]
        let thisAmount = 0;
        
        switch (play.type) {
            case "tragedy" : 
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy" : 
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${play.type}`)
        }

        volumeCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`
        totalAmount += thisAmount;
    }
    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립 포인트: ${volumeCredits}점`;
    return result;   
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


