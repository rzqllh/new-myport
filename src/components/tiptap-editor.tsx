"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextHOne,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  Quotes,
  Code,
  LinkSimple,
  ArrowCounterClockwise,
  ArrowClockwise,
  Minus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
        active && "bg-muted text-foreground",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({ value, onChange, placeholder, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Write something..." }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL", editor!.getAttributes("link").href ?? "");
    if (url === null) return;
    if (url === "") { editor!.chain().focus().unsetLink().run(); return; }
    editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className={cn("rounded-xl border border-border overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <ArrowCounterClockwise weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <ArrowClockwise weight="bold" size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarButton label="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <TextHOne weight="bold" size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <TextHTwo weight="bold" size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <TextHThree weight="bold" size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <TextB weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <TextItalic weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <TextStrikethrough weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <Code weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={setLink} active={editor.isActive("link")}>
          <LinkSimple weight="bold" size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarButton label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <ListBullets weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListNumbers weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quotes weight="bold" size={15} />
        </ToolbarButton>
        <ToolbarButton label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <Code weight="duotone" size={16} />
        </ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus weight="bold" size={15} />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
