import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';

// Pedigreeデータの型を定義
type PedigreeData = {
  generation_1: string;
  generation_2: string;
  generation_3: string;
  generation_4: string;
  generation_5: string;
};

const PedigreeTable = () => {
  // 型を指定して状態を初期化
  const [pedigreeData, setPedigreeData] = useState<PedigreeData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.3.160:8000/api');
        setPedigreeData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const tableHead = ['Generation 1', 'Generation 2', 'Generation 3', 'Generation 4', 'Generation 5'];
  const tableData = pedigreeData.map((row) => [
    row.generation_1,
    row.generation_2,
    row.generation_3,
    row.generation_4,
    row.generation_5,
  ]);

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

export default PedigreeTable;
