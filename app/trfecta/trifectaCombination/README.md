```  
const generateCombinations = (horses: number[]) => {
    const combinations: number[][] = [];
    for (let i = 0; i < horses.length; i++) {
      for (let j = i + 1; j < horses.length; j++) {
        for (let k = j + 1; k < horses.length; k++) {
          combinations.push([horses[i], horses[j], horses[k]]);
        }
      }
    }
    return combinations;
  };
```


`number[][]:`
二次元配列の型を表します。
各要素が number[] 型の配列であり、それをまとめた配列です。
具体的な例として、以下のような値を持つことができます：
```
const combinations: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```
