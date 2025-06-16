# Welcome to your Expo app 👋

| プロパティ                                    | 説明                                              |
| ---------------------------------------- | ----------------------------------------------- |
| `dependentAxis`                          | この VictoryAxis が **Y軸（従属軸）** であることを指定。X軸との区別に使う |
| `tickFormat={(y) => y.toLocaleString()}` | Y軸の目盛ラベルの数字を **カンマ区切り** で整形して表示する               |

```
<VictoryAxis dependentAxis tickFormat={(y) => y.toLocaleString()} />
```

