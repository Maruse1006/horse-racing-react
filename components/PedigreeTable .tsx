import React, { useState } from "react";
import axios from "axios";

const PedigreeTable = () => {
  const [horseName, setHorseName] = useState("");
  const [pedigreeData, setPedigreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPedigreeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8081/get_pedigree", {
        horse_name: horseName, // 入力された馬名を送信
      });

      // 重複を削除したユニークなデータに整形
      const uniqueData = response.data.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.generation_1 === value.generation_1 &&
          t.generation_2 === value.generation_2 &&
          t.generation_3 === value.generation_3 &&
          t.generation_4 === value.generation_4 &&
          t.generation_5 === value.generation_5
        ))
      );

      setPedigreeData(uniqueData);
    } catch (err) {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // rowSpanを計算する関数
  const calculateRowSpan = (data, generationKey) => {
    let spanMap = {};
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0 || data[i][generationKey] !== data[i - 1][generationKey]) {
        if (count > 0) {
          spanMap[i - count] = count;
        }
        count = 1;
      } else {
        count++;
      }
    }
    if (count > 0) {
      spanMap[data.length - count] = count;
    }
    return spanMap;
  };

  // rowSpanを生成
  const rowSpanMap = {
    generation_1: calculateRowSpan(pedigreeData, "generation_1"),
    generation_2: calculateRowSpan(pedigreeData, "generation_2"),
    generation_3: calculateRowSpan(pedigreeData, "generation_3"),
    generation_4: calculateRowSpan(pedigreeData, "generation_4"),
    generation_5: calculateRowSpan(pedigreeData, "generation_5"),
  };

  // 世代に基づくスタイルを適用（父方と母方を色分け）
  const getCellStyle = (generationKey) => {
    const isFatherSide = generationKey.endsWith("1") || generationKey.endsWith("3") || generationKey.endsWith("5");
    return isFatherSide
      ? { backgroundColor: "#d8f3dc" } // 父方の色（薄い緑）
      : { backgroundColor: "#f0f4c3" }; // 母方の色（薄い黄色）
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={horseName}
        onChange={(e) => setHorseName(e.target.value)}
        placeholder="馬名を入力してください"
        style={styles.input}
      />
      <button onClick={fetchPedigreeData} style={styles.button}>
        データを取得
      </button>

      {loading && <p>ロード中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>5代血統表</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Generation 1</th>
              <th>Generation 2</th>
              <th>Generation 3</th>
              <th>Generation 4</th>
              <th>Generation 5</th>
            </tr>
          </thead>
          <tbody>
            {pedigreeData.map((entry, index) => (
              <tr key={index}>
                {Object.keys(rowSpanMap).map((key) => (
                  rowSpanMap[key][index] ? (
                    <td key={key} rowSpan={rowSpanMap[key][index]} style={getCellStyle(key)}>
                      {entry[key]}
                    </td>
                  ) : null
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: 20, fontFamily: "Arial, sans-serif" },
  input: { padding: 10, fontSize: 16, marginRight: 10 },
  button: { padding: "10px 20px", fontSize: "16px", cursor: "pointer" },
  tableContainer: { maxHeight: "400px", overflowY: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
};

export default PedigreeTable;
