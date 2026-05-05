package com.example.dataviz;

import com.opencsv.CSVReader;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Service
public class DataParserService {

    public DatasetResponse parseDataFile(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        List<Map<String, Object>> data = new ArrayList<>();
        List<String> headers = new ArrayList<>();

        if (filename != null && filename.endsWith(".csv")) {
            try (Reader reader = new InputStreamReader(file.getInputStream());
                    CSVReader csvReader = new CSVReader(reader)) {

                String[] headerRow = csvReader.readNext();
                if (headerRow != null) {
                    headers = Arrays.asList(headerRow);
                }

                String[] nextRecord;
                while ((nextRecord = csvReader.readNext()) != null) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 0; i < headers.size(); i++) {
                        String value = i < nextRecord.length ? nextRecord[i] : "";
                        row.put(headers.get(i), parseValue(value));
                    }
                    data.add(row);
                }
            }
        } else if (filename != null && (filename.endsWith(".xlsx") || filename.endsWith(".xls"))) {
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);
                Row headerRow = sheet.getRow(0);
                if (headerRow != null) {
                    for (Cell cell : headerRow) {
                        headers.add(cell.getStringCellValue());
                    }
                }

                for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row != null) {
                        Map<String, Object> rowData = new LinkedHashMap<>();
                        for (int j = 0; j < headers.size(); j++) {
                            Cell cell = row.getCell(j);
                            rowData.put(headers.get(j), getCellValue(cell));
                        }
                        data.add(rowData);
                    }
                }
            }
        } else {
            throw new IllegalArgumentException("Unsupported file type. Please upload a CSV or Excel file.");
        }

        List<ColumnMetadata> columns = inferColumnTypes(headers, data);
        return new DatasetResponse(filename, columns, data);
    }

    private Object parseValue(String value) {
        if (value == null || value.trim().isEmpty())
            return null;
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return value;
        }
    }

    private Object getCellValue(Cell cell) {
        if (cell == null)
            return null;
        switch (cell.getCellType()) {
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return cell.getNumericCellValue();
                }
            case STRING:
                return parseValue(cell.getStringCellValue());
            case BOOLEAN:
                return cell.getBooleanCellValue() ? "true" : "false";
            default:
                return "";
        }
    }

    private List<ColumnMetadata> inferColumnTypes(List<String> headers, List<Map<String, Object>> data) {
        List<ColumnMetadata> columns = new ArrayList<>();

        for (String header : headers) {
            String type = "categorical"; // Default
            int numCount = 0;
            int totalCount = 0;

            for (Map<String, Object> row : data) {
                Object val = row.get(header);
                if (val != null && !val.toString().isEmpty()) {
                    totalCount++;
                    if (val instanceof Number) {
                        numCount++;
                    }
                }
                if (totalCount > 100)
                    break; // sample first 100
            }

            if (totalCount > 0 && (double) numCount / totalCount > 0.8) {
                type = "numerical";
            }

            columns.add(new ColumnMetadata(header, type));
        }

        return columns;
    }
}