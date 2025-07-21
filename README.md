##　３連系の組み合わせ計算 👋

### 三連複ボックス
```
for (let i = 0; i < horseNumbers.length; i++) {
  for (let j = i + 1; j < horseNumbers.length; j++) {
    for (let k = j + 1; k < horseNumbers.length; k++) {
      combinations.push([horseNumbers[i], horseNumbers[j], horseNumbers[k]]);
    }
  }
}

```

#### 1. for (let i = 0; i < horseNumbers.length; i++)
馬のリスト (horseNumbers) から1頭目を選ぶループ

i は 1頭目のインデックス

#### 2. for (let j = i + 1; j < horseNumbers.length; j++)
2頭目を選ぶループ
i + 1 から始めるので
1頭目と同じ馬を選ばない
(1,2) と (2,1) の重複を防ぐ

####  3. for (let k = j + 1; k < horseNumbers.length; k++)
3頭目を選ぶループ
同様に j + 1 から始めるので
1頭目・2頭目と同じ馬を選ばない
重複する組み合わせを防ぐ

| i | j | k | 結果       |
| - | - | - | -------- |
| 0 | 1 | 2 | \[1,2,3] |
| 0 | 1 | 3 | \[1,2,4] |
| 0 | 2 | 3 | \[1,3,4] |
| 1 | 2 | 3 | \[2,3,4] |

### 三連複ボックス
```
  const generateTrifectaBox = (horseNumbers: number[]) => {
    const results: number[][] = [];

    // 組合せ生成
    const getCombinations = (arr: number[], k: number): number[][] => {
      const res: number[][] = [];
      const helper = (start: number, combo: number[]) => {
        if (combo.length === k) {
          res.push([...combo]);
          return;
        }
        for (let i = start; i < arr.length; i++) {
          helper(i + 1, [...combo, arr[i]]);
        }
      };
      helper(0, []);
      return res;
    };

    // 順列生成
    const getPermutations = (arr: number[]): number[][] => {
      const res: number[][] = [];
      const permute = (temp: number[], remaining: number[]) => {
        if (remaining.length === 0) {
          res.push(temp);
          return;
        }
        for (let i = 0; i < remaining.length; i++) {
          const next = remaining.slice();
          const current = next.splice(i, 1);
          permute(temp.concat(current), next);
        }
      };
      permute([], arr);
      return res;
    };


```

入力:
```
arr = [1,2,3]
```
1️⃣ 最初の呼び出し

```
permute([], [1,2,3])
```
temp: [] ← 今まで選んだ要素

remaining: [1,2,3] ← まだ選んでない要素


2️⃣ 最初のforループ: i=0
```
const next = [1,2,3].slice();     // コピー: [1,2,3]
const current = next.splice(0,1); // current: [1], next: [2,3]
permute([1], [2,3]);              // ✅ 1を選んで再帰へ
```

3️⃣ 2回目のforループ: i=0
```
permute([1], [2,3])

const next = [2,3].slice();       // コピー: [2,3]
const current = next.splice(0,1); // current: [2], next: [3]
permute([1,2], [3]);              // ✅ 2を選んで再帰へ
```

4️⃣ 3回目のforループ: i=0
```
permute([1,2], [3])

const next = [3].slice();         // コピー: [3]
const current = next.splice(0,1); // current: [3], next: []
permute([1,2,3], []);             // ✅ 完成
```

5️⃣ 完成した順列を保存
```
res.push([1,2,3]);

```

6️⃣ 戻って別の道を探索
```
permute([1], [2,3])
```
から
```
permute([1,3,2], [])
```
という別ルートが探索されます。

permute([], [1,2,3])
├─ 1選択 → permute([1], [2,3])
│   ├─ 2選択 → permute([1,2], [3])
│   │   ├─ 3選択 → permute([1,2,3], []) ✅ 保存
│   ├─ 3選択 → permute([1,3], [2])
│       ├─ 2選択 → permute([1,3,2], []) ✅ 保存
├─ 2選択 → permute([2], [1,3])
│   ...
├─ 3選択 → permute([3], [1,2])
│   ...



