import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RiAddLine, RiGroupLine, RiSearchLine } from "react-icons/ri";
import { createClient, editClient, fetchClients, removeClient } from "../api/clientApi";
import ClientCard from "../components/ClientCard";
import ClientForm from "../components/ClientForm";
import ConfirmModal from "../components/ConfirmModal";
import LoadingState from "../components/LoadingState";
import usePageTitle from "../utils/usePageTitle";

const Clients = () => {
  usePageTitle("Clients");
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClientId, setDeletingClientId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [query, setQuery] = useState("");

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const { data } = await fetchClients();
      setClients(data);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return clients;
    return clients.filter((client) =>
      [client.name, client.email, client.phone, client.gstin]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [clients, query]);

  const handleSubmit = async (values) => {
    try {
      if (editingClient) await editClient(editingClient._id, values);
      else await createClient(values);
      toast.success(editingClient ? "Client updated" : "Client added");
      setIsOpen(false);
      setEditingClient(null);
      await loadClients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save client");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await removeClient(id);
      toast.success("Client deleted");
      setDeletingClientId("");
      await loadClients();
    } catch {
      toast.error("Failed to delete client");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
            <RiGroupLine className="text-[color:var(--muted)]" /> Client Manager
          </h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Add, edit, and maintain client records in one place.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <RiSearchLine className="pointer-events-none absolute left-3 top-3 text-[color:var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="field-input pl-10"
              placeholder="Search clients"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingClient(null);
              setIsOpen(true);
            }}
            className="btn-primary w-full sm:w-auto"
          >
            <RiAddLine /> Add Client
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredClients.map((client) => (
          <ClientCard
            key={client._id}
            client={client}
            onEdit={(c) => {
              setEditingClient(c);
              setIsOpen(true);
            }}
            onDelete={(id) => setDeletingClientId(id)}
          />
        ))}
      </div>

      {loadingClients ? (
        <LoadingState label="Loading clients" variant="card" />
      ) : null}

      {!loadingClients && !filteredClients.length ? (
        <div className="shell-card p-8 text-center text-sm text-[color:var(--muted)]">No clients yet. Add your first client to start invoicing.</div>
      ) : null}

      <ClientForm
        isOpen={isOpen}
        initialData={editingClient}
        onClose={() => {
          setIsOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        isOpen={Boolean(deletingClientId)}
        title="Delete this client?"
        description="This action cannot be undone and may affect invoice history references."
        confirmText="Delete"
        confirmClassName="btn-danger"
        loading={deleting}
        onCancel={() => setDeletingClientId("")}
        onConfirm={() => handleDelete(deletingClientId)}
      />
    </section>
  );
};

export default Clients;
