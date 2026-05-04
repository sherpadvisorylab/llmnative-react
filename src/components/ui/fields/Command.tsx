import React, { createContext, useContext, useRef, useState } from "react";

type CommandContextType = {
  registerTrigger: (trigger: string, config: TriggerConfig) => void;
  activeTrigger: string | null;
  filter: string;
  setFilter: (f: string) => void;
  insert: (node: React.ReactNode | string) => void;
  caretPos: { x: number; y: number } | null;
};

const CommandContext = createContext<CommandContextType | null>(null);

type TriggerConfig = {
  onSelect: (value: string) => React.ReactNode;
};

export const Command: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<TriggerProps>;
} = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [caretPos, setCaretPos] = useState<{ x: number; y: number } | null>(null);
  const triggersRef = useRef<Record<string, TriggerConfig>>({});

  const registerTrigger = (trigger: string, config: TriggerConfig) => {
    triggersRef.current[trigger] = config;
  };

  const insert = (node: React.ReactNode | string) => {
    if (!ref.current) return;

    if (typeof node === "string") {
      document.execCommand("insertText", false, node + " ");
    } else {
      // Badge inserito come nodo React → semplificato
      const span = document.createElement("span");
      span.className = "badge bg-primary me-1";
      span.innerText = (node as any).props.children;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        sel.getRangeAt(0).insertNode(span);
      }
    }

    setActiveTrigger(null);
    setFilter("");
  };

  const handleInput = () => {
    const sel = window.getSelection();
    if (!sel) return;

    const text = sel.anchorNode?.textContent || "";
    const char = text[sel.anchorOffset - 1];

    if (triggersRef.current[char]) {
      setActiveTrigger(char);
      setFilter("");
      const range = sel.getRangeAt(0).cloneRange();
      const rect = range.getBoundingClientRect();
      setCaretPos({ x: rect.left, y: rect.bottom });
    } else if (activeTrigger) {
      const match = text.split(activeTrigger).pop() || "";
      setFilter(match);
    }
  };

  return (
    <CommandContext.Provider
      value={{ registerTrigger, activeTrigger, filter, setFilter, insert, caretPos }}
    >
      <div className="position-relative">
        <div
          ref={ref}
          className="form-control"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          style={{ minHeight: "40px" }}
        />
        {children}
      </div>
    </CommandContext.Provider>
  );
};

type TriggerProps = {
  char: string;
  onSelect: (value: string) => React.ReactNode;
  children: (props: { filter: string; select: (value: string) => void }) => React.ReactNode;
};

const Trigger: React.FC<TriggerProps> = ({ char, onSelect, children }) => {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("Command.Trigger must be inside <Command>");

  const { registerTrigger, activeTrigger, filter, insert, caretPos } = ctx;

  React.useEffect(() => {
    registerTrigger(char, { onSelect });
  }, [char, onSelect]);

  if (activeTrigger !== char || !caretPos) return null;

  const select = (value: string) => {
    const node = onSelect(value);
    insert(node);
  };

  return (
    <div
      className="position-absolute"
      style={{ top: caretPos.y + 5, left: caretPos.x }}
    >
      {children({ filter, select })}
    </div>
  );
};

Command.Trigger = Trigger;
