import React, { useState } from 'react';
import { useAllUsers } from './AllUsersContext';
import { useUser } from './UserContext';
import { UsersIcon } from './icons/UsersIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EditUserModal } from './EditUserModal';
import type { User } from '../types';

export const AdminPage: React.FC = () => {
    const { users, updateUser, deleteUser } = useAllUsers();
    const { user: currentUser } = useUser();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleEditClick = (user: User) => {
        setEditingUser(user);
    };

    const handleDeleteClick = (userToDelete: User) => {
        if (userToDelete.email === currentUser?.email) {
            alert("ไม่สามารถลบบัญชีของตัวเองได้");
            return;
        }
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ ${userToDelete.name} (${userToDelete.email})?`)) {
            deleteUser(userToDelete.email);
        }
    };

    const handleSaveUser = (updatedUser: User) => {
        updateUser(updatedUser);
        setEditingUser(null);
    };
    
    if (currentUser?.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="text-gray-500">You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center mb-12">
                <div className="inline-flex justify-center text-[#FF8C69] mb-4 bg-orange-100 p-4 rounded-full">
                    <UsersIcon />
                </div>
                <h1 className="text-4xl font-extrabold text-[#004D40] tracking-tight">จัดการสมาชิก</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    จัดการข้อมูลผู้ใช้ทั้งหมดในระบบ
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-orange-200">
                        <thead className="bg-orange-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.email}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name} {user.role === 'admin' && <span className="text-xs text-red-500">(Admin)</span>}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.points.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.registeredAt).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-4">
                                            <button onClick={() => handleEditClick(user)} className="text-teal-600 hover:text-teal-900" title="Edit user">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-900" title="Delete user" disabled={user.email === currentUser.email}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {editingUser && (
                <EditUserModal 
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};