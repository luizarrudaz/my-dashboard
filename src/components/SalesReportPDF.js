import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
    },
    section: {
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    table: {
        display: 'table',
        width: '100%',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableCell: {
        padding: 5,
        flex: 1,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
        whiteSpace: 'nowrap',
    },
});

const SalesReportPDF = ({ salesSummary, filteredSales }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.section}>Resumo de Vendas por Vendedor</Text>
            <View style={styles.table}>
                {salesSummary.map((summary, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{summary.nome_vendedor}</Text>
                        <Text style={styles.tableCell}>{summary.quantidade_total}</Text>
                        <Text style={styles.tableCell}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total_vendido)}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.section}>Relatório de Vendas</Text>
            <View style={styles.table}>
                {filteredSales.map((sale, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{sale.nome_produto}</Text>
                        <Text style={styles.tableCell}>{new Date(sale.data_venda).toLocaleDateString('pt-BR')}</Text>
                        <Text style={styles.tableCell}>{new Intl.NumberFormat('pt-BR').format(sale.quantidade_vendida)}</Text>
                        <Text style={styles.tableCell}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.preco_total)}</Text>
                        <Text style={styles.tableCell}>{sale.nome_vendedor}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default SalesReportPDF;