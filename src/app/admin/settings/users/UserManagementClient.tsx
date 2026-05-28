'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Edit2, Trash2, Shield, User, Clock, Check, X, Search 
} from 'lucide-react';
import { createPengguna, updatePengguna, deletePengguna } from '@/app/actions/pengguna';
import Swal from 'sweetalert2';

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');

  const MODUL_OPTIONS = [
    { id: 'penduduk', label: 'Data Kependudukan' },
    { id: 'surat', label: 'Layanan Surat' },
    { id: 'transparansi', label: 'Transparansi & APBDes' },
    { id: 'gis', label: 'Pemetaan GIS' },
    { id: 'potensi', label: 'UMKM & Potensi' },
    { id: 'pkk', label: 'Kegiatan PKK' },
    { id: 'posyandu', label: 'Posyandu & e-KMS' },
    { id: 'pengaturan', label: 'Pengaturan Sistem' },
  ];

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const filteredUsers = users.filter((u: any) => 
    u.namaPetugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.peran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user: any = null) => {
    setEditingUser(user);
    if (user && user.aksesModul) {
      try {
        setSelectedModules(JSON.parse(user.aksesModul));
      } catch (e) {
        setSelectedModules([]);
      }
    } else {
      setSelectedModules(MODUL_OPTIONS.map(m => m.id)); // Default all selected
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setSelectedModules([]);
  };

  const handleModuleToggle = (modulId: string) => {
    setSelectedModules(prev => 
      prev.includes(modulId) ? prev.filter(id => id !== modulId) : [...prev, modulId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add id if editing
    if (editingUser) {
      formData.append('id', editingUser.id.toString());
    }

    // Add selected modules
    formData.append('aksesModul', JSON.stringify(selectedModules));

    startTransition(async () => {
      let result;
      if (editingUser) {
        result = await updatePengguna(formData);
      } else {
        result = await createPengguna(formData);
      }

      if (result.error) {
        Swal.fire('Gagal', result.error, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: editingUser ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          handleCloseModal();
          window.location.reload(); 
        });
      }
    });
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Hapus pengguna?',
      text: "Data pengguna ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deletePengguna(id);
          if (res.error) {
            Swal.fire('Gagal', res.error, 'error');
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Pengguna berhasil dihapus',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.reload();
            });
          }
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari pengguna..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama Petugas</th>
              <th className="px-6 py-4 font-semibold">Username</th>
              <th className="px-6 py-4 font-semibold">Peran</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Login Terakhir</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-slate-800">{u.namaPetugas}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">
                      {u.username}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className={u.peran === 'Admin' ? 'text-amber-500' : 'text-slate-400'} />
                      <span className="font-medium">{u.peran}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-semibold border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock size={14} />
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('id-ID') : 'Belum pernah login'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(u)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Pengguna"
                      >
                        <Edit2 size={16} />
                      </button>
                      {u.username !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={isPending}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Petugas / Lengkap</label>
                <input 
                  type="text" 
                  name="namaPetugas"
                  defaultValue={editingUser?.namaPetugas}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <input 
                  type="text" 
                  name="username"
                  defaultValue={editingUser?.username}
                  required
                  disabled={editingUser?.username === 'admin'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100"
                  placeholder="Contoh: budi.s"
                />
                {editingUser?.username === 'admin' && (
                  <input type="hidden" name="username" value="admin" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password {editingUser && <span className="text-slate-400 font-normal">(Kosongkan jika tidak ingin diubah)</span>}
                </label>
                <input 
                  type="password" 
                  name="password"
                  required={!editingUser}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Masukkan password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hak Akses / Peran</label>
                <select 
                  name="peran"
                  defaultValue={editingUser?.peran || 'Operator'}
                  disabled={editingUser?.username === 'admin'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="Admin">Admin Utama</option>
                  <option value="Kepala Desa">Kepala Desa</option>
                  <option value="Kasi Pemerintahan">Kasi Pemerintahan</option>
                  <option value="Operator">Operator</option>
                </select>
                {editingUser?.username === 'admin' && (
                  <input type="hidden" name="peran" value="Admin" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Akses Modul</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                  {MODUL_OPTIONS.map((modul) => (
                    <label key={modul.id} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedModules.includes(modul.id) 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-300 text-transparent group-hover:border-blue-400'
                      }`}>
                        <Check size={14} />
                      </div>
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={selectedModules.includes(modul.id)}
                        onChange={() => handleModuleToggle(modul.id)}
                        disabled={editingUser?.username === 'admin'}
                      />
                      <span className="text-xs font-medium text-slate-700">{modul.label}</span>
                    </label>
                  ))}
                </div>
                {editingUser?.username === 'admin' && (
                  <p className="text-[10px] text-amber-600 mt-1.5">*Admin Utama memiliki akses penuh ke semua modul.</p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      name="isActive"
                      value="true"
                      defaultChecked={editingUser ? editingUser.isActive : true}
                      disabled={editingUser?.username === 'admin'}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Akun Aktif</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
                >
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
