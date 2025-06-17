#  VictoryAxisについて

| プロパティ                                    | 説明                                              |
| ---------------------------------------- | ----------------------------------------------- |
| `dependentAxis`                          | この VictoryAxis が **Y軸（従属軸）** であることを指定。X軸との区別に使う |
| `tickFormat={(y) => y.toLocaleString()}` | Y軸の目盛ラベルの数字を **カンマ区切り** で整形して表示する               |

```
<VictoryAxis dependentAxis tickFormat={(y) => y.toLocaleString()} />
```

## バックエンドから返却された値をカレンダーの日付に対応させる
横軸に日付を表示させたいが、betsテーブルに格納されているdate_infoは開催日（何日目か）のみ２桁で格納されており、
calendarData から 該当する開催日（YYYY-MM-DD） を特定する必要がある。

```
const findActualDate = (calendarData, dateInfo, placeId, round) => {
  for (const date in calendarData) {
    const entries = calendarData[date];
    for (const entry of entries) {
      if (
        entry.placeId === placeId &&
        entry.round === round &&
        entry.day === dateInfo
      ) {
        return date;
      }
    }
  }
  return null;
};

```
calendarDataがオブジェクトでdateという日付を定義
下の例だと2024-12-06にあたる

```
export const calendarData = {
  "2024-12-06": [
    { placeId: "06", round: "第1回", day: "01" }, // 中山競馬場
    { placeId: "09", round: "第2回", day: "01" }, // 阪神競馬場
  ],
};
```

