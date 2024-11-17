import React, { useState } from 'react';
import axios from 'axios';

const PedigreeTable = () => {
  const [pedigreeData, setPedigreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // APIからデータを取得する関数
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://192.168.3.160:8000/api');
      setPedigreeData(response.data);
    } catch (error) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  let previousEntry = {};

  return (
    <div style={styles.container}>
      <button onClick={fetchData} style={styles.button}>
        データを取得
      </button>
      
      {loading && <p>ロード中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>5代血統表</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerCell}>Generation 1</th>
              <th style={styles.headerCell}>Generation 2</th>
              <th style={styles.headerCell}>Generation 3</th>
              <th style={styles.headerCell}>Generation 4</th>
              <th style={styles.headerCell}>Generation 5</th>
            </tr>
          </thead>
          <tbody>
            {pedigreeData.map((entry, index) => {
              const row = (
                <tr key={index}>
                  <td style={styles.cell}>
                    {previousEntry.generation_1 !== entry.generation_1 ? entry.generation_1 : ""}
                  </td>
                  <td style={styles.cell}>
                    {previousEntry.generation_2 !== entry.generation_2 ? entry.generation_2 : ""}
                  </td>
                  <td style={styles.cell}>
                    {previousEntry.generation_3 !== entry.generation_3 ? entry.generation_3 : ""}
                  </td>
                  <td style={styles.cell}>
                    {previousEntry.generation_4 !== entry.generation_4 ? entry.generation_4 : ""}
                  </td>
                  <td style={styles.cell}>
                    {previousEntry.generation_5 !== entry.generation_5 ? entry.generation_5 : ""}
                  </td>
                </tr>
              );

              previousEntry = entry;
              return row;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  tableContainer: {
    maxHeight: '400px',  // テーブル全体の高さを制限（400pxまで）
    overflowY: 'auto',   // 垂直方向にスクロール可能
    border: '2px solid #000', // テーブル全体の外枠線を太く表示
    borderCollapse: 'separate', // 内部の枠線を分離
    borderSpacing: '0',  // 内部セルのスペースを消す
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerCell: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    fontWeight: 'bold',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  cell: {
    padding: '8px',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
};

export default PedigreeTable;
