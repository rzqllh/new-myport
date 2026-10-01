"use client";

import * as React from "react";
import { Plus, Check, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminCardBody } from "./admin-card";

export interface CrudListProps<T extends { id: string }> {
  items: T[];
  itemName?: string;
  renderItem: (
    item: T,
    actions: {
      startEdit: () => void;
      deleteItem: () => void;
      isDeleting: boolean;
    }
  ) => React.ReactNode;
  renderForm: (
    draft: Partial<T>,
    onChange: (patch: Partial<T>) => void
  ) => React.ReactNode;
  onAdd: (draft: Partial<T>) => Promise<void>;
  onUpdate: (id: string, draft: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  blankItem: Partial<T>;
  onReorder?: (items: T[]) => Promise<void>;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function CrudList<T extends { id: string }>({
  items,
  itemName = "Item",
  renderItem,
  renderForm,
  onAdd,
  onUpdate,
  onDelete,
  blankItem,
}: CrudListProps<T>) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<Partial<T> | null>(null);
  const [addingNew, setAddingNew] = React.useState(false);
  const [newDraft, setNewDraft] = React.useState<Partial<T>>(blankItem);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const startEdit = (item: T) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
    setError(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editDraft) return;
    setLoadingId(id);
    setError(null);
    try {
      await onUpdate(id, editDraft);
      setEditingId(null);
      setEditDraft(null);
    } catch (err: unknown) {
      setError(errorMessage(err, "Failed to update"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${itemName.toLowerCase()}?`)) return;
    setLoadingId(id);
    setError(null);
    try {
      await onDelete(id);
    } catch (err: unknown) {
      setError(errorMessage(err, "Failed to delete"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleAdd = async () => {
    setLoadingId("new");
    setError(null);
    try {
      await onAdd(newDraft);
      setAddingNew(false);
      setNewDraft({ ...blankItem });
    } catch (err: unknown) {
      setError(errorMessage(err, "Failed to add"));
    } finally {
      setLoadingId(null);
    }
  };

  const cancelAdd = () => {
    setAddingNew(false);
    setNewDraft({ ...blankItem });
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error ? (
        <div className="bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {items.length === 0 && !addingNew ? (
        <p className="text-sm text-muted-foreground">
          No {itemName.toLowerCase()}s yet.
        </p>
      ) : null}

      {items.length > 0 ? (
        <AdminCard>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {editingId === item.id && editDraft ? (
                <AdminCardBody>
                  {renderForm(editDraft, (patch) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, ...patch } : prev
                    )
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={loadingId === item.id}
                    >
                      <Check weight="bold" size={14} />
                      {loadingId === item.id ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X weight="bold" size={14} />
                      Cancel
                    </Button>
                  </div>
                </AdminCardBody>
              ) : (
                renderItem(item, {
                  startEdit: () => startEdit(item),
                  deleteItem: () => handleDelete(item.id),
                  isDeleting: loadingId === item.id,
                })
              )}
            </React.Fragment>
          ))}
        </AdminCard>
      ) : null}

      {addingNew ? (
        <AdminCard>
          <AdminCardBody>
            <p className="text-sm font-medium">New {itemName}</p>
            {renderForm(newDraft, (patch) =>
              setNewDraft((prev) => ({ ...prev, ...patch }))
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={loadingId === "new"}
              >
                {loadingId === "new" ? "Adding..." : "Add"}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelAdd}>
                Cancel
              </Button>
            </div>
          </AdminCardBody>
        </AdminCard>
      ) : (
        <Button
          variant="outline"
          onClick={() => setAddingNew(true)}
          className="gap-2"
        >
          <Plus weight="bold" size={16} />
          Add {itemName}
        </Button>
      )}
    </div>
  );
}
