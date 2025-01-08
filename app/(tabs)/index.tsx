// Layout.tsx
import React, { useState } from 'react';

export default function Layout() {
  const [pedigreeData, setPedigreeData] = useState([]);

  // データ取得時に setPedigreeData を呼び出してデータを更新
  const handleDataFetch = (data: any) => {
    setPedigreeData(data);
  };

  return (
    <div>a</div>
  );
}