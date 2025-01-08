// Layout.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import RequestButton from '../components/RequestButton';
import PedigreeTable from '../components/PedigreeTable ';

export default function Blood() {
  const [pedigreeData, setPedigreeData] = useState([]);

  // データ取得時に setPedigreeData を呼び出してデータを更新
  const handleDataFetch = (data: any) => {
    setPedigreeData(data);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RequestButton onFetchData={handleDataFetch} />
      <PedigreeTable data={pedigreeData} /> {/* 取得したデータを PedigreeTable に渡す */}
    </SafeAreaView>
  );
}