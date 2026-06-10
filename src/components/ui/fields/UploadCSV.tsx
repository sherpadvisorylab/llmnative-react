import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Wrapper } from '../GridSystem';
import { Icon, normalizeKey, UIProps } from '../../..';
import { cn } from '../../../libs/cn';
import { smartTypeCast } from '../../../libs/utils';
import { Label, FieldError } from './Input';

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
  onClear?: () => void;
  onParseField?: UploadCSVParseFieldHandler;
  label?: string;
  icon?: string;
  delimiter?: string;
  normalizeKeys?: boolean;
  removeEmptyFields?: boolean;
  required?: boolean;
}

export const UploadCSV: React.FC<UploadCSVProps> = ({
  name,
  onDataLoaded,
  onClear            = undefined,
  onParseField       = undefined,
  label              = undefined,
  icon               = "upload",
  delimiter          = undefined,
  normalizeKeys      = false,
  removeEmptyFields  = false,
  required           = false,
  before             = undefined,
  after              = undefined,
  wrapperClassName   = undefined,
  className          = undefined,
}) => {
  const [error,      setError    ] = useState<string | null>(null);
  const [dragOver,   setDragOver ] = useState(false);
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sanitizeField = ([key, value]: UploadCSVParseField) => {
    if (["", null, undefined].includes(key)) return;
    if (value === undefined) return;
    if (removeEmptyFields && ["", null].includes(value)) return;
    if (normalizeKeys) key = normalizeKey(key);
    if (onParseField) return onParseField([key, value]);
    return [key.trim(), smartTypeCast(value)] as UploadCSVParseField;
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter,
      dynamicTyping: false,
      complete: (results: ParseResult<UploadCSVRow>) => {
        setError(null);
        setLoadedFile(file);
        onDataLoaded({
          data: results.data.map(item =>
            Object.fromEntries(
              Object.entries(item).reduce<UploadCSVParseField[]>((acc, [k, v]) => {
                const sanitized = sanitizeField([k, v]);
                if (sanitized) acc.push(sanitized);
                return acc;
              }, [])
            )
          ),
          fields: (results.meta?.fields || []).reduce<string[]>((acc, field) => {
            if (!field) return acc;
            acc.push(normalizeKeys ? normalizeKey(field) : field);
            return acc;
          }, []),
          file,
        });
      },
      error: (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoadedFile(null);
      },
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
    // reset so the same file can be re-selected
    event.target.value = '';
  };

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(true);  };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const triggerInput = () => fileInputRef.current?.click();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Wrapper className={wrapperClassName}>
      {before}
      <div className={cn(className)} data-name={name}>
        {label && <Label label={label} required={required} />}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,text/csv,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Loaded state */}
        {loadedFile ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-3">
              {/* File type badge */}
              <div className="w-9 h-9 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Icon name="file-text" className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{loadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(loadedFile.size)}</p>
              </div>

              {/* Success badge */}
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium shrink-0">
                <Icon name="check-circle" className="w-4 h-4" />
                Loaded
              </div>

              {/* Remove / replace */}
              <button
                type="button"
                onClick={() => { setLoadedFile(null); onClear?.(); }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Icon name="x" className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upload another row */}
            <div className="px-3 py-2 border-t border-border bg-muted/20">
              <button
                type="button"
                onClick={triggerInput}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon name="refresh-cw" className="w-3.5 h-3.5" />
                Upload another file
              </button>
            </div>
          </div>
        ) : (
          /* Drop zone */
          <button
            type="button"
            onClick={triggerInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 px-4 transition-colors cursor-pointer',
              dragOver
                ? 'border-primary/60 bg-primary/8 text-primary'
                : 'border-muted-foreground/25 bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary/70',
            )}
          >
            <Icon name={icon} className="w-8 h-8" />
            <span className="text-sm font-medium">
              {dragOver ? 'Drop to parse' : 'Click to upload or drag and drop'}
            </span>
            <span className="text-xs opacity-60">.csv, .tsv</span>
          </button>
        )}

        {error && <FieldError message={`Parse error: ${error}`} />}
      </div>
      {after}
    </Wrapper>
  );
};
