package com.example.dataviz;

import java.util.List;
import java.util.Map;

public class DatasetResponse {
    private List<ColumnMetadata> columns;
    private List<Map<String, Object>> data;
    private String filename;

    public DatasetResponse(String filename, List<ColumnMetadata> columns, List<Map<String, Object>> data) {
        this.filename = filename;
        this.columns = columns;
        this.data = data;
    }

    public List<ColumnMetadata> getColumns() { return columns; }
    public void setColumns(List<ColumnMetadata> columns) { this.columns = columns; }
    
    public List<Map<String, Object>> getData() { return data; }
    public void setData(List<Map<String, Object>> data) { this.data = data; }
    
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
}
