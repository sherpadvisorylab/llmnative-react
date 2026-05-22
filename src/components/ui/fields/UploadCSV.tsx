import React, { useState, ChangeEvent, DragEvent } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Wrapper } from '../GridSystem';
import { Icon, normalizeKey, UIProps } from '../../..';
import { cn } from '../../../libs/cn';
import { smartTypeCast } from '../../../libs/utils';

export type UploadCSVCell = string | null | undefined;
export interface UploadCSVRow {
  [key: string]: UploadCSVCell;
}
export interface UploadCSVData {
  data: UploadCSVRow[];
  fields: string[];
  file: File;
}
export type UploadCSVParseField = [key: string, value: UploadCSVCell];
export type UploadCSVDataLoadedHandler = (results: UploadCSVData) => void;
export type UploadCSVParseFieldHandler = (field: UploadCSVParseField) => UploadCSVParseField | undefined;

interface UploadCSVProps extends UIProps {
  name: string;
  onDataLoaded: UploadCSVDataLoadedHandler;
  onParseField?: UploadCSVParseFieldHandler;
  label?: string;
  icon?: string;
  delimiter?: string;
  normalizeKeys?: boolean;
  removeEmptyFields?: boolean;
}

export const UploadCSV: React.FC<UploadCSVProps> = ({
  name,
  onDataLoaded,
  onParseField  = undefined,
  label         = undefined,
  icon          = "upload",
  delimiter     = undefined,
  normalizeKeys = false,
  removeEmptyFields = false,
  pre           = undefined,
  post          = undefined,
  wrapClass     = undefined,
  className     = undefined,
}) => {
  const [error, setError] = useState<string | null>(null);

  const sanitizeField = ([key, value]: UploadCSVParseField) => {
    if (["", null, undefined].includes(key)) return;
    if (value === undefined) return;
    if (removeEmptyFields && ["", null].includes(value)) return;
    if (normalizeKeys) key = normalizeKey(key);
    if (onParseField) return onParseField([key, value]);
    return [key.trim(), smartTypeCast(value)] as UploadCSVParseField;
  }

  const handleFile = (file: File | null) => {
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
      dynamicTyping: false,
      complete: (results: ParseResult<UploadCSVRow>) => {
        setError(null);
        onDataLoaded({
          data: results.data.map(item =>
            Object.fromEntries(
              Object.entries(item).reduce<UploadCSVParseField[]>((acc, [k, v]) => {
                const sanitizedField = sanitizeField([k, v]);
                if (sanitizedField) acc.push(sanitizedField);
                return acc;
              }, [])
            )
          ), 
          fields: (results.meta?.fields || []).reduce<string[]>((acc, field) => {
            if (!field) return acc;
            acc.push(normalizeKeys ? normalizeKey(field) : field);
            return acc;
          }, []), 
          file: file
        });
      },
      error: (err: any) => {
        setError(err.message);
      },
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    file && handleFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Wrapper className={wrapClass}>
      {pre}
      <div
        data-name={name}
        className={cn("fileinput-button", className)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.tsv,text/csv,text/plain"
        />
        <Icon name={icon} label={label || "Drag or click to upload"} />
      </div>

      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}
      {post}
    </Wrapper>
  );
};

