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

### 1. for (let i = 0; i < horseNumbers.length; i++)
馬のリスト (horseNumbers) から1頭目を選ぶループ

i は 1頭目のインデックス



