
#### parseResponseTcp 코드 추가

let value = [];
for (let i = 9; i < buf.length; i += 2) {
    value.push(buf.readIntBE(i, 2));
}
res.value = value;

tcp 응답 프로토콜에서 데이터 영역을 어레이에 정수로 저장함

