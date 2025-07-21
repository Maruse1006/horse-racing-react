#　３連系の組み合わせ計算 👋


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
